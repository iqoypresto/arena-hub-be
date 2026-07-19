import "dotenv/config";
import express from "express";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { env } from "./config/env.config";
import cookieParser from "cookie-parser";
import { AuthRoute } from "./features/auth/auth.route";
import { CourtRoute } from "./features/court/court.route";
import { BookingRoute } from "./features/booking/booking.route";
import { VenueRoute } from "./features/venue/venue.route";
import { BookingJob } from "./jobs/booking.job";
import { DashboardRoute } from "./features/dashboard/dashboard.route";
import "./config/mailer.config";

const app = express();

app.use(
  cors({
    origin: env.WHITE_LIST,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());

app.use(cookieParser());

app.use(`${env.API_PREFIX}/auth`, AuthRoute);
app.use(`${env.API_PREFIX}/venue`, VenueRoute);
app.use(`${env.API_PREFIX}/court`, CourtRoute);
app.use(`${env.API_PREFIX}/booking`, BookingRoute);
app.use(`${env.API_PREFIX}/dashboard`, DashboardRoute);

app.use(ErrorMiddleware);

app.listen(env.PORT, () => {
  console.log(`[⚡APP] Application is running on port: ${env.PORT}`);

  BookingJob.start();
});

export default app;
