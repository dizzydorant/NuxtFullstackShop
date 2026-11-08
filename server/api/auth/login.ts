import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Пожалуйста, заполните все поля",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный Email или пароль",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Неверный Email или пароль",
      });
    }

    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    setCookie(event, "auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  } catch (error: any) {
    // Временно выводим полную ошибку прямо в браузер для отладки
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Неизвестная ошибка бэкенда",
    });
  }
});
