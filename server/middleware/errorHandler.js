class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let errorMessage = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: { message: errorMessage },
  });

  next();
};

module.exports = { CustomError, errorHandler };
