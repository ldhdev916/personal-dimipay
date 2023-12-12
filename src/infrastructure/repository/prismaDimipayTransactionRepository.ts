import {DimipayTransactionRepository} from "@/domain/repository/dimipayTransactionRepository";
import {singleton} from "tsyringe";
import {DimipayTransaction} from "@/domain/dimipayTransaction";
import {PrismaClient} from "@prisma/client";

@singleton()
export class PrismaDimipayTransactionRepository implements DimipayTransactionRepository {

    private readonly prisma = new PrismaClient()

    async save(transaction: DimipayTransaction): Promise<void> {
        await this.prisma.dimipayTransaction.create({
            data: {
                at: transaction.at.toDate(),
                price: transaction.price,
                products: transaction.products,
            }
        })
    }

}