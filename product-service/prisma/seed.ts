import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  const mobile = await prisma.category.upsert({
    where: { slug: "mobile" },
    update: {},
    create: { name: "Điện thoại", slug: "mobile", description: "Điện thoại smartphone" }
  });
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15 Pro", slug: "iphone-15-pro", price: 27990000, stock: 50,
        categoryId: mobile.id
      },
      {
        name: "Samsung Galaxy S24", slug: "samsung-s24", price: 22990000, stock: 30,
        categoryId: mobile.id
      },
    ],
    skipDuplicates: true
  });
  console.log(" Seed thành công!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });