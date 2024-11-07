const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('./config/passport')
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const router = require('./routes/index')
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(passport.initialize())
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter)
app.use(compression())

app.use('/api', router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

module.exports = app;