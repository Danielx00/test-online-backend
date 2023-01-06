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
  returnTime: { type: String, default: '' },
  student: { type: Schema.Types.Number, ref: 'users' },
  setId: { type: Schema.Types.ObjectId, ref: 'sets' },
  status: { type: String, default: 'Inaccessible' },
  questions: { type: Array, default: [] },
  faculty: { type: Schema.Types.ObjectId, ref: 'faculties' },
  scoredPoints: { type: Number, default: 0 },
  maxPoints: { type: Number, default: 0 },
});

module.exports = model('studentExams', StudentExamSchema);
