const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const routes = require('./routes/router');
app.use('/api', routes);


app.use((err, req, res, next) => {
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
    error:
            {message:
                  errorMessage}});
},
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
},
);
