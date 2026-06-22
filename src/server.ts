import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Application is running on port: ${env.PORT}`);
});