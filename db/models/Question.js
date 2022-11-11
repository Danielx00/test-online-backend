const { Schema, model } = require('mongoose');

const Question = new Schema({
  title: {
    type: String,
    required: true,
  },
  answers: {
    type: Array,
    default: null,
  },
});
module.exports = model('questions', Question);
