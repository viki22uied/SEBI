class ErrorResponse extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode || 500;
    this.data = data;
    this.isOperational = true;
    
    // Capture the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  // Static method to create a 400 Bad Request error
  static badRequest(message = 'Bad Request', data = null) {
    return new ErrorResponse(message, 400, data);
  }

  // Static method to create a 401 Unauthorized error
  static unauthorized(message = 'Not authorized to access this route') {
    return new ErrorResponse(message, 401);
  }

  // Static method to create a 403 Forbidden error
  static forbidden(message = 'Forbidden') {
    return new ErrorResponse(message, 403);
  }

  // Static method to create a 404 Not Found error
  static notFound(resource = 'Resource') {
    return new ErrorResponse(`${resource} not found`, 404);
  }

  // Static method to create a 409 Conflict error
  static conflict(message = 'Conflict', data = null) {
    return new ErrorResponse(message, 409, data);
  }

  // Static method to create a 422 Unprocessable Entity error
  static validationError(errors) {
    return new ErrorResponse('Validation Error', 422, { errors });
  }

  // Static method to create a 429 Too Many Requests error
  static tooManyRequests(message = 'Too many requests, please try again later.') {
    return new ErrorResponse(message, 429);
  }

  // Static method to create a 500 Internal Server Error
  static serverError(message = 'Internal Server Error') {
    return new ErrorResponse(message, 500);
  }

  // Method to send the error response
  send(res) {
    const response = {
      success: false,
      error: this.message,
      ...(this.data && { data: this.data }),
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };

    return res.status(this.statusCode).json(response);
  }
}

module.exports = ErrorResponse;
