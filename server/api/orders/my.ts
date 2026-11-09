import { prisma } from "../../utils/prisma";

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

    const query = getQuery(event);
    const page = Math.max(1, parseInt((query.page as string) || "1", 10));
    const limit = Math.max(1, parseInt((query.limit as string) || "5", 10));

    const skip = (page - 1) * limit;

    const client = prisma as any;

    const [totalOrders, orders] = await Promise.all([
      client.order.count({
        where: { userId: decoded.userId },
      }),
      client.order.findMany({
        where: { userId: decoded.userId },
        skip: skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return {
      orders,
      meta: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({
      statusCode: 500,
      statusMessage: "Внутренняя ошибка сервера при загрузке истории заказов",
    });
  }
});
