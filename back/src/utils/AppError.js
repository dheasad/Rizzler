class AppError extends Error {
  constructor(statusCode, message, isOperational = statusCode < 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // true = expected business logic errors (validation, not found, unauthorized)
    // false = unexpected programming errors that should trigger alerts
    this.isOperational = Boolean(isOperational);
    this.shouldNotify = !this.isOperational;
    this.userMessage = this.isOperational
      ? message
      : "An unexpected error occurred";
    this.severity = this.isOperational ? "warning" : "critical";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
