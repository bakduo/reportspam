
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    user: {
        type: String,
        required: true,
        default: '',
      },
    email: {
      type: String,
        required: true,
        default: ''
    },
    passwd:{
        type: String,
        required: true,
        default: ''
    },
  },
  { collection: 'users' }
);

module.exports = UserSchema;