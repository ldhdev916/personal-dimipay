import {Dayjs} from "dayjs";
import {DimipayTransaction} from "@/domain/dimipayTransaction";

export interface DimipayProvider {
    getQRData(): Promise<{ value: string, expiresAt: Dayjs }>

    watchTransaction(): Promise<DimipayTransaction | undefined>
}