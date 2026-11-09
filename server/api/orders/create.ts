export default defineEventHandler(async (event) => {
  try {
    const token = getCookie(event, "auth_token");
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "Необходимо войти в систему",
      });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: "Сессия истекла, войдите заново",
      });
    }

    const body = await readBody(event);
    const { items }: { items: { id: number; quantity: number }[] } = body;

    if (!items || items.length === 0) {
      throw createError({ statusCode: 400, statusMessage: "Корзина пуста" });
    }

    const productIds = items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalOrderPrice = 0;
    const orderItemsData = items.map((cartItem) => {
      const dbProduct = dbProducts.find((p) => p.id === cartItem.id);
      if (!dbProduct) {
        throw createError({
          statusCode: 404,
          statusMessage: `Товар с ID ${cartItem.id} не найден`,
        });
      }

      const itemTotal = dbProduct.price * cartItem.quantity;
      totalOrderPrice += itemTotal;

      return {
        productId: dbProduct.id,
        quantity: cartItem.quantity,
        price: dbProduct.price,
      };
    });

    const result = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId: decoded.userId,
          total: totalOrderPrice,
          status: "PENDING",
        },
      });

      const finalItems = orderItemsData.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }));

      await tx.orderItem.createMany({
        data: finalItems,
      });

      return newOrder;
    });

    return {
      success: true,
      orderId: result.id,
      total: result.total,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера при создании заказа",
    });
  }
});
