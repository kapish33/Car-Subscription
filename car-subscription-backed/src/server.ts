import cors from 'cors';
import express, { Express, json, urlencoded } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import cookieParser from 'cookie-parser';

import { connectDB } from './config/db';
import { subscriptionRouter } from '@/api/subscription/subscriptionRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();
connectDB();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser());

// Body parsing middleware
app.use(json()); // Parse JSON bodies
app.use(urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);
app.use('/subscription', subscriptionRouter);
// app.use('/schedules', scheduleRouter);
// app.use('/cars', carRouter);
// app.use('/plans', planRouter);
// app.use('/payments', paymentRouter);
// app.use('/reports', reportRouter);


// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
