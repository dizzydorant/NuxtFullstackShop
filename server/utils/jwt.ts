import { SignJWT, jwtVerify } from "jose";

const getSecretKey = () => {
  const config = useRuntimeConfig();
  return new TextEncoder().encode(config.jwtSecret);
};

export const generateToken = async (payload: {
  userId: number;
  email: string;
}) => {
  const secret = getSecretKey();

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export const verifyToken = async (token: string) => {
  try {
    const secret = getSecretKey();

    const { payload } = await jwtVerify(token, secret);

    return payload as { userId: number; email: string };
  } catch (error) {
    return null;
  }
};
