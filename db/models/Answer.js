const { Schema, model } = require('mongoose');

const Answer = new Schema({
  answers: [
    {
      title: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        default: 0,
      },
      disabledDelete: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = model('answers', Answer);
