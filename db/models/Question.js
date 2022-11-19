const { Schema, model } = require('mongoose');

const Question = new Schema({
  question: {
    type: String,
    required: true,
  },
  disabledEdit: {
    type: Boolean,
    default: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  answers: { type: Array, ref: 'answers', default: [] },
});
module.exports = model('questions', Question);
