const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('./db/mongoose');
require('dotenv/config');
// Initialize the application
// const Exam = require('./db/models/Exam');

// const exam = new Exam({
//   title: 'exam1',
//   description: 'for testing',
//   students: [123, 33321, 12444],
//   set: '636eba4f7e62ae165502a9d3',
//   date: '11-11-2022',
//   startExam: '18:00',
//   endExam: '19:00',
//   owner: '635c260dc4b22c07602c3e21',
//   faculty: '634bd89ddcdc8c8dd45a0f01',
// });
// exam.save();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

require('./middlewares/passport')(passport);

// User routes
app.use('/api/users', require('./routes/users'));

app.use('/api/faculties', require('./routes/faculties'));

app.use('/api/sets', require('./routes/sets'));

app.use('/api/questions', require('./routes/questions'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
