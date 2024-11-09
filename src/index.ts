import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import router from './routes/index';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger';
import { AppDataSource } from "./data-source"
import { runSeeders } from 'typeorm-extension';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(passport.initialize());

AppDataSource.initialize().then(async () => {
  // await AppDataSource.synchronize(true);
  // await runSeeders(AppDataSource);
  // process.exit();
}).catch(error => console.log(error));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(compression());

// Routes
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
