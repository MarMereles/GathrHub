/*
  Warnings:

  - You are about to drop the column `cliente` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `correo` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `duracion` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `horaFin` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horaInicio` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_salonId_fkey";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "cliente",
DROP COLUMN "correo",
DROP COLUMN "duracion",
ADD COLUMN     "horaFin" TEXT NOT NULL,
ADD COLUMN     "horaInicio" TEXT NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'pendiente';

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT,
    "creadoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
