const { Schema, model } = require('mongoose');

const FacultySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  users: [{ type: Schema.Types.Number, ref: 'users' }],
  img: {
    type: String,
    default:
      'https://brandingmonitor.pl/wp-content/uploads/2017/11/new-rebranding-logo-uniwersytetu-warminsko-mazurskiego-696x300.png',
  },
});

module.exports = model('faculties', FacultySchema);
