const { Schema, model } = require('mongoose');

const StudentExamSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startExam: { type: String, required: true },
  endExam: { type: String, required: true },
  date: {
    type: Date,
    required: true,
  },
  assignedExam: { type: Schema.Types.ObjectId, ref: 'exams' },
  student: { type: Schema.Types.Number, ref: 'users' },
  setId: { type: Schema.Types.ObjectId, ref: 'sets' },
  status: { type: String, default: 'Inaccessible' },
  questions: { type: Array, default: [] },
  faculty: { type: Schema.Types.ObjectId, ref: 'faculties' },
});

module.exports = model('studentExams', StudentExamSchema);
