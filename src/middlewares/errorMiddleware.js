/* eslint-disable no-unused-vars */
// const logger = require('../loggers/logger');

const errorMiddleware = (err, _req, res, _next) => {
  const errorMessage = err.message.startsWith('Error: ')
    ? err.message.slice(7) // Remove the "Error: " prefix
    : err.message;

  // logger.info(errorMessage);
  if (err.statusCode) {
    res.status(err.statusCode).json({
      isSuccess: false,
      message: errorMessage,
    });
  } else {
    res.json({
      isSuccess: false,
      message: errorMessage,
    });
  }
};

module.exports = errorMiddleware;
/* eslint-enable no-unused-vars */
