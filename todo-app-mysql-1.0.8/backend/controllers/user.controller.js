const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Todo = require('../models/todo.model');

const cleanUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};

const UserController = {
  createUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const result = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword
      });

      return res.status(201).json({ user: cleanUser(result) });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Email déjà utilisé' });
      }
      return res.status(500).json({ message: "Erreur inscription" });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.sub).select('-password');
      return user ? res.status(200).json({ user }) : res.status(404).json({ message: "Utilisateur non trouvé" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  editUser: async (req, res) => {
    try {
      const user = await User.findById(req.sub);
      if (!user) return res.status(404).json({ message: "Non trouvé" });

      user.name = req.body.name || user.name;
      user.address = req.body.address || user.address;
      
      const result = await user.save();
      return res.status(200).json({ user: cleanUser(result) });
    } catch (error) {
      return res.status(500).json({ message: "Erreur mise à jour" });
    }
  },

  deleteCurrentUser: async (req, res) => {
    try {
      await Todo.deleteMany({ user_id: req.sub });
      await User.findByIdAndDelete(req.sub);
      return res.status(200).json({ message: "Compte supprimé" });
    } catch (error) {
      return res.status(500).json({ message: "Erreur suppression" });
    }
  }
};

module.exports = UserController;