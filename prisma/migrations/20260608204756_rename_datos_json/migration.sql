/*
  Warnings:

  - You are about to drop the column `datosJson` on the `Pedido` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pedido" DROP COLUMN "datosJson",
ADD COLUMN     "datosInvitacion" JSONB DEFAULT '{}';
