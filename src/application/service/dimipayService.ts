import {DimipayProvider} from "@/application/service/dimipayProvider";
import {DimipayTransactionRepository} from "@/domain/repository/dimipayTransactionRepository";

export class DimipayService {

    constructor(private readonly provider: DimipayProvider, private readonly repository: DimipayTransactionRepository) {
    }

    getQRData() {
        return this.provider.getQRData()
    }

    async watchTransaction() {
        const transaction = await this.provider.watchTransaction()

        if (transaction) {
            console.log("Saving transaction", transaction)
            await this.repository.save(transaction)
        }

        return !!transaction
    }
}