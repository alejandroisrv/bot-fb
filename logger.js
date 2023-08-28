const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const errorTransport = new transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: combine(
        timestamp(),
        myFormat
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5
});

const appTransport = new transports.File({
    filename: 'logs/app.log',
    format: combine(
        timestamp(),
        myFormat
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5
});


const logger = createLogger({
    transports: [
        errorTransport,
        appTransport
    ]
});

module.exports = logger;