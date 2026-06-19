import express, { Request, Response } from 'express'

const PORT: number = 8000;

const app = express()

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello, world!',
  });
});

app.listen(PORT, () => {
  console.log(`Application is running on port: ${PORT}`);
});