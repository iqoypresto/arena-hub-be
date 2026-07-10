import "dotenv/config"

export const env = {
  PORT: Number(process.env.PORT) || 8000,
  API_PREFIX: process.env.API_PREFIX,
  WHITE_LIST: process.env.WHITE_LIST?.split(','),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};