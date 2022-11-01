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
  },
  date: {
    type: Date,
    required: true,
  },
  startExam: {
    type: Date,
    required: true,
  },
  endExam: {
    type: Date,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = model('exams', ExamSchema);
