const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
    // Sous MongoDB, il n'y a pas de distinction entre STRING et TEXT('long').
    // Tout est géré par String, sans limite de taille arbitraire.
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
    // C'est l'équivalent Mongoose d'une clé étrangère.
    // Au lieu d'un INTEGER, MongoDB utilise un format unique appelé ObjectId.
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Fait le lien avec le modèle 'User' exporté précédemment
    required: true
  }
}, { 
  versionKey: false 
});

// Équivalent du FULLTEXT dans MySQL pour optimiser les recherches
todoSchema.index({ text: 'text' });

module.exports = mongoose.model('Todo', todoSchema);