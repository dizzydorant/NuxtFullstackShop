export default defineEventHandler((event) => {
  deleteCookie(event, "auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return {
    success: true,
    message: "Вы успешно вышли из системы",
  };
});
