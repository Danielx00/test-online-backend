const { Schema, model } = require('mongoose');

const ExamSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  students: [{ type: Schema.Types.Number, ref: 'users' }],
  set: {
    type: Schema.Types.ObjectId,
    ref: 'sets',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startExam: {
    type: String,
    required: true,
  },
  endExam: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'faculties',
  },
});

module.exports = model('exams', ExamSchema);
