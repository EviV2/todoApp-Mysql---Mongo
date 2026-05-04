const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: null
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  user_id: {
    //foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ref a model user
    required: true
  }
}, { 
  versionKey: false 
});

// index sur text pour rechercher plus vite
todoSchema.index({ text: 'text' });

module.exports = mongoose.model('Todo', todoSchema);