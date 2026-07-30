import { PrismaClient } from '../src/generated/prisma/client';
import salonesDePrueba from '../src/data/seeds';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding salones...');
  // Limpia la tabla en entorno de desarrollo para evitar duplicados
  await prisma.salon.deleteMany({});
  await prisma.salon.createMany({ data: salonesDePrueba });
  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
