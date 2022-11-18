const { Schema, model } = require('mongoose');

const Question = new Schema({
  title: {
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
  answers: {
    type: Array,
    default: [],
  },
});
module.exports = model('questions', Question);
