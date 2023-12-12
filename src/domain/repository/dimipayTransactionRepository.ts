import {DimipayTransaction} from "@/domain/dimipayTransaction";

export interface DimipayTransactionRepository {
    save(transaction: DimipayTransaction): Promise<void>
}