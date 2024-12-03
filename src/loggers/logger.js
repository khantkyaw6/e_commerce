const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logDirectory = './src/loggers/logs';

require('fs').mkdirSync(logDirectory, { recursive: true });

const transport = new DailyRotateFile({
  filename: `${logDirectory}/%DATE%-application.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // compress old log files
  maxSize: '20m', // keep logs for up to 20mb
  maxFiles: '14d', // Keeps logs for 14 days
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  circular: false,
  transports: [new winston.transports.Console(), transport],
});

module.exports = logger;
