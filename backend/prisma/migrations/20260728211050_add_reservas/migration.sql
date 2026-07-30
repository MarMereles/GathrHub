-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "cliente" TEXT NOT NULL,
    "correo" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "duracion" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "notas" TEXT,
    "creadoAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "salones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
