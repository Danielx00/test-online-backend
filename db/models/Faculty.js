const { Schema, model } = require('mongoose');

const FacultySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
});

module.exports = model('faculties', FacultySchema);
