
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    message: {
        type: String,
        required: true,
        default: '',
      },
    domain: {
      type: String,
        required: false,
        default: ''
    },
    email: {
      type: String,
        required: true,
        default: ''
    },
    ip: {
      type: String,
        required: false,
        default: ''
    },
    description:{
        type: String,
        required: true,
        default: ''
    },
    time: {
      type: String,
      required: false,
      default:  new Date().toLocaleDateString('es-AR'),
    },
  },
  { collection: 'messages' }
);

module.exports = MessageSchema;