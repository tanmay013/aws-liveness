class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const safeMessage = statusCode >= 500 ? "Internal server error." : error.message;

  console.error("[error]", {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });

  res.status(statusCode).json({
    message: safeMessage
  });
};

module.exports = {
  AppError,
  notFoundHandler,
  errorHandler
};
