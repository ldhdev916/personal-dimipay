import {Dayjs} from "dayjs";

export type DimipayTransaction = Readonly<{
    at: Dayjs,
    price: number,
    products: string[]
}>