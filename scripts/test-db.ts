import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const b = await prisma.booking.findMany();
  console.log(b);
}
main().finally(() => prisma.$disconnect());
