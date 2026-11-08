import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Начало наполнения базы данных...");

  await prisma.product.deleteMany();

  const productsList = [
    {
      title: "Беспроводные наушники SoundWave X",
      description:
        "Наушники с активным шумоподавлением и автономностью до 40 часов.",
      price: 5990.0,
      image: "https://unsplash.com",
    },
    {
      title: "Умные часы ChronoFit Pro",
      description:
        "AMOLED дисплей, измерение пульса, датчик кислорода в крови и 100+ спортивных режимов.",
      price: 8490.0,
      image: "https://unsplash.com",
    },
    {
      title: "Игровая клавиатура ClickMaster Mech",
      description:
        "Компактная механика на надежных свитчах с яркой RGB подсветкой и PBT кейкапами.",
      price: 4200.0,
      image: "https://unsplash.com",
    },
  ];

  for (const item of productsList) {
    const createdProduct = await prisma.product.create({
      data: item,
    });
    console.log(
      `Товар "${createdProduct.title}" успешно добавлен с ID: ${createdProduct.id}`,
    );
  }

  console.log("База данных успешно наполнена всеми товарами!");
}

main()
  .catch((e) => {
    console.error("Ошибка при сидинге:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
