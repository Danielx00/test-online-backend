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
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'faculties',
  },
});
module.exports = model('sets', SetSchema);
