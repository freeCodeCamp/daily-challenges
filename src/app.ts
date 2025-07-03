import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import routes from './routes';

const app = express();

app.use(helmet());

// Todo: Add rate limiting?

const allowedOrigins = [
  'https://www.freecodecamp.org',
  'https://www.freecodecamp.dev'
];

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true
  })
);

app.use(express.json());
app.use(routes);

export default app;
