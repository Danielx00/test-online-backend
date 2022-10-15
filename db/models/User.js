const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'student',
      enum: ['student', 'employee', 'admin'],
    },
    img: {
      type: String,
      default: '',
    },
    numberOfIndex: {
      type: Number,
      required: true,
      unique: true,
    },
    faculties: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model('users', UserSchema);
