module.exports = (err, res) => {
  let statusCode = err.status || 500;
  let errorMessage = '';

  if (err.name === 'ValidationError') {
    statusCode = 404;
    errorMessage = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Acess denied ';
  } else {
    errorMessage = 'Internal Server Error';
  }

  res.status(statusCode).json({
    error: {message: errorMessage},
  });
};

