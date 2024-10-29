const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white'
    }
};

const logger = winston.createLogger({
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(
            (info) => `${info.timestamp} [${info.level}]: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
        }),
        new DailyRotateFile({
            level: 'info',
            filename: path.join(__dirname, '../../logs/application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

winston.addColors(logLevels.colors);

module.exports = logger;
