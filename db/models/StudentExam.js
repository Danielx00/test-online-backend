const { Schema, model } = require('mongoose');

const StudentExamSchema = new Schema({
  assignedExam: { type: Schema.Types.ObjectId, ref: 'exams' },
  student: { type: Schema.Types.Number, ref: 'users' },
  status: { type: String, default: 'Inaccessible' },
  answers: { type: Array, default: [] },
  faculty: { type: Schema.Types.ObjectId, ref: 'faculties' },
});

module.exports = model('studentExams', StudentExamSchema);
