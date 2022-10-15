const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db/mongoose');
require('dotenv/config');
// Initialize the application

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// User routes
app.use('/api/users', require('./routes/users'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
