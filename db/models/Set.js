const { Schema, model } = require('mongoose');

const SetSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [{ type: Schema.Types.ObjectId, ref: 'questions' }],
});
module.exports = model('sets', SetSchema);
