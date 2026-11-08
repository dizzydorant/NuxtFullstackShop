export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) {
    return { user: null };
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return { user: null };
  }

  return {
    user: {
      id: decoded.userId,
      email: decoded.email,
    },
  };
});
