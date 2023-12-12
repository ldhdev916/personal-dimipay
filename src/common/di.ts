import "reflect-metadata"
import {DimipayProvider} from "@/application/service/dimipayProvider";
import {container, instanceCachingFactory} from "tsyringe";
import {DimipayTransactionRepository} from "@/domain/repository/dimipayTransactionRepository";
import {PrismaDimipayTransactionRepository} from "@/infrastructure/repository/prismaDimipayTransactionRepository";
import {DimipayService} from "@/application/service/dimipayService";
import {RestDimipayProvider} from "@/infrastructure/service/restDimipayProvider";

container.register(DimipayService, {
    useFactory: instanceCachingFactory(() => new DimipayService(dimipayProvider(), dimipayTransactionRepository()))
})

export const dimipayService = () => container.resolve(DimipayService)

export const dimipayProvider = () => {
    const resolved = container.resolve<DimipayProvider>(RestDimipayProvider)

    console.log(resolved)

    return resolved

}

export const dimipayTransactionRepository = () => container.resolve<DimipayTransactionRepository>(PrismaDimipayTransactionRepository)