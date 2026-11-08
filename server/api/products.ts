export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Ошибка при получении товаров из базы данных",
    });
  }
});
