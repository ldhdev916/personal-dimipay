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

export const dimipayProvider = () => container.resolve<DimipayProvider>(RestDimipayProvider)

export const dimipayTransactionRepository = () => container.resolve<DimipayTransactionRepository>(PrismaDimipayTransactionRepository)