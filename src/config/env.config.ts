import "dotenv/config"

export const env = {
  PORT: Number(process.env.PORT) || 8000,
  API_PREFIX: process.env.API_PREFIX,
  WHITE_LIST: process.env.WHITE_LIST?.split(','),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
  MAIL_SECURE: process.env.MAIL_SECURE === "true",
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
  FRONTEND_URL: process.env.FRONTEND_URL,
};