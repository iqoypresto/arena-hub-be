import "dotenv/config";
import express from "express";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import { AuthRoute } from "./features/auth/auth.route";

const app = express();

app.use(
  cors({
    origin: env.WHITE_LIST,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  }),
);
app.use(express.json());

app.use(cookieParser())

app.use(`${env.API_PREFIX}/auth`, AuthRoute)

app.use(ErrorMiddleware);

if(process.env.NODE_ENV === 'development'){
  app.listen(env.PORT, () => {
    console.log(`[⚡APP] Application is running on port: ${env.PORT}`);
  })
}
export default app