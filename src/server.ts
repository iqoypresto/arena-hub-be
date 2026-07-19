import app from "./app";
import { env } from "./config/env.config";
import { BookingJob } from "./jobs/booking.job";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);

  BookingJob.start();
});