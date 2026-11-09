import { prisma } from "~/server/utils/prisma";

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
    const client = prisma as any;
    const orders = await client.order.findMany({
      where: {
        userId: decoded.userId,
      },
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
    });

    return orders;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Неизвестная ошибка бэкенда",
    });
  }
});
