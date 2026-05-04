const bcrypt = require('bcrypt');
const User = require('../models/user.model'); // Import direct du modèle Mongoose
const Todo = require('../models/todo.model'); // Import du modèle Todo pour le CASCADE

const cleanUser = (user) => {
  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await User.create({
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 8)
      });

      return res.status(201).json({ user: cleanUser(result) });
    } catch (error) {
      console.error('ADD USER: ', error);
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'Un compte avec cet email existe déjà !' });
      }
      return res.status(500).json({ message: "Erreur lors de l'inscription !" });
    }
  },

  getUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const result = await User.findById(user_id).select('-password');

      if (result) {
        return res.status(200).json({ user: result });
      } else {
        return res.status(404).json({ message: "Non trouvé" });
      }
    } catch (error) {
      console.error('GET USER: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  editUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const data = req.body;

      const user = await User.findById(user_id);
      
      if (user) {
        user.name = data.name ? data.name : null;
        user.address = data.address ? data.address : null;
        user.zip = data.zip ? data.zip : null;
        user.location = data.location ? data.location : null;
        
        const result = await user.save();
        return res.status(200).json({ user: cleanUser(result) });
      } else {
        return res.status(404).json({ message: "Non trouvé" });
      }
    } catch (error) {
      console.error('UPDATE USER: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  },

  deleteCurrentUser: async (req, res) => {
    //Essayer de delete en cascade tous ce qui découle de l'zser
    try {
      const user_id = req.sub;
      await Todo.deleteMany({ user_id: user_id });
      await User.deleteOne({ _id: user_id });
      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error('DELETE USER: ', error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }
};

module.exports = UserController;