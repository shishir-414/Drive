const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, 'path is required']
  },
  originalname: {
    type: String,
    required: [true, 'original name is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Ensure this matches the model name of your user schema
    required: [true, 'user is required']
  }
});

const fileModel = mongoose.model('File', fileSchema);  // Make sure the model name is 'File' (capital 'F')

module.exports = fileModel;  // Export the model correctly
