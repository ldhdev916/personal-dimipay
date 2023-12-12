-- CreateTable
CREATE TABLE "DimipayTransaction" (
    "id" SERIAL NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "products" TEXT[],

    CONSTRAINT "DimipayTransaction_pkey" PRIMARY KEY ("id")
);
