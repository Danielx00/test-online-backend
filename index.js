const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db/mongoose');
require('dotenv/config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
