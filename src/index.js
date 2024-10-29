const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const router = require('./routes/index')
const logger = require('./utils/logger');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(helmet())
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

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});