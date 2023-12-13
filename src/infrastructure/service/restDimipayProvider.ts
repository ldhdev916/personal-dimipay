import {DimipayProvider} from "@/application/service/dimipayProvider";
import {singleton} from "tsyringe";
import dayjs, {Dayjs} from "dayjs";
import {DimipayTransaction} from "@/domain/dimipayTransaction";
import {EventSourcePolyfill} from "event-source-polyfill";

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

        eventSource.onopen = (event) => {
            console.log("OPEN at", dayjs(), event)
        }

        eventSource.onerror = async (event) => {
            console.log("ERROR at", dayjs(), event)

            if ("status" in event && event.status == 401) {
                console.log("Unauthorized refreshing token in EventSource")

                await this.doRefreshToken()

                this.watchTransaction().then()
            }
        }

        eventSource.onmessage = ({data}) => {
            console.log("DATA", data, typeof data)

            if (typeof data == "string") {
                const {status}: { status?: string } = JSON.parse(data)

                console.log("Received status", status)
            }
        }

        await new Promise(resolve => setTimeout(resolve, 20000))

        return
    }

}