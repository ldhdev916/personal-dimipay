import {DimipayProvider} from "@/application/service/dimipayProvider";
import {singleton} from "tsyringe";
import dayjs, {Dayjs} from "dayjs";
import {DimipayTransaction} from "@/domain/dimipayTransaction";
import {EventSourcePolyfill} from "event-source-polyfill";

interface RestDimipayTransaction {
    totalPrice: number
    createdAt: string
    products: { name: string }[]
}

@singleton()
export class RestDimipayProvider implements DimipayProvider {

    private readonly baseUrl = "https://api.dimipay.io"

    private readonly refreshToken = process.env.DIMIPAY_REFRESH_TOKEN!
    private readonly id = process.env.DIMIPAY_PAYMENT_ID!
    private readonly pin = process.env.DIMIPAY_PIN!

    private accessToken: string | undefined

    private async doRefreshToken() {
        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.refreshToken}`
            }
        })

        const {accessToken}: { accessToken: string } = await response.json()

        this.accessToken = accessToken
    }

    private async execute(accessToken: string) {
        const response = await fetch(`${this.baseUrl}/payment/token`, {
            method: "POST",
            body: JSON.stringify({id: this.id, pin: this.pin}),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        })

        if (response.status == 401) return

        const {code, exp}: { code: string, exp: string } = await response.json()

        return {
            value: code,
            expiresAt: dayjs(exp)
        }
    }

    async getQRData(): Promise<{ value: string; expiresAt: Dayjs }> {
        if (!this.accessToken) {
            await this.doRefreshToken()
        }

        const result = await this.execute(this.accessToken!)

        if (result) return result

        await this.doRefreshToken()

        return (await this.execute(this.accessToken!))!
    }

    async watchTransaction(): Promise<DimipayTransaction | undefined> {

        if (!this.accessToken) {
            await this.doRefreshToken()
        }

        const eventSource = new EventSourcePolyfill(`${this.baseUrl}/payment/response`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            },
            heartbeatTimeout: 1000 * 60 * 6
        })

        const result = await Promise.race([
            new Promise<DimipayTransaction>(resolve => {

                eventSource.onerror = async (event) => {
                    console.log("ERROR at", dayjs(), event)

                    if ("status" in event && event.status == 401) {
                        console.log("Unauthorized refreshing token in EventSource")

                        await this.doRefreshToken()

                        this.watchTransaction()
                    }
                }

                eventSource.onmessage = ({data}) => {
                    try {
                        const {status}: { status?: string } = JSON.parse(data)

                        if (status == "CONFIRMED") {
                            resolve(this.getLatestTransaction())
                        }
                    } catch (e) {

                    }
                }
            }),
            new Promise<undefined>(resolve => setTimeout(resolve, 1000 * 60 * 2))
        ])

        console.log("Result", result)

        return
    }

    private async getLatestTransaction(): Promise<DimipayTransaction> {
        const response = await fetch(`${this.baseUrl}/transaction/my`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        })

        const [transaction]: RestDimipayTransaction[] = await response.json()

        return {
            at: dayjs(transaction.createdAt),
            price: transaction.totalPrice,
            products: transaction.products.map(({name}) => name)
        }
    }
}