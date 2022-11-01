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
});
module.exports = model('sets', SetSchema);
