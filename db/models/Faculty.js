const { Schema, model } = require('mongoose');

const FacultySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  users: [{ type: Schema.Types.Number, ref: 'users' }],
});

module.exports = model('faculties', FacultySchema);
