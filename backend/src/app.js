import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

import { userRouter } from './routes/user.routes.js';
import { messageRouter } from './routes/message.routes.js';
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);

export {app}
