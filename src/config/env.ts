export const env = {
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  JWT_SECRET: process.env.JWT_SECRET || "arenahub-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};