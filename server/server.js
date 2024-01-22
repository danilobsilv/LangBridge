require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/router');
const errorHandler = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');


app.use(cors());
app.use(helmet()); // to avoid web vulnerabilities (http header config)
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:100  // to limit each ip to a maximum of 100 requests per 15 minutes
}))

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
},
);
