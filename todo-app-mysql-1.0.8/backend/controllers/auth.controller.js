const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken'); 
const User = require('../models/user.model');
const JWT_SECRET = require('../config/keys').JWT_SECRET;

const cleanUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const AuthController = {
  loginUser: async (req, res) => {
    try {
      const result = await User.findOne({ email: req.body.email.toLowerCase() });

      if (result) {
        if (bcrypt.compareSync(req.body.password, result.password)) {
          const user = cleanUser(result);
          
          const token = jsonwebtoken.sign({}, JWT_SECRET, {
            subject: result._id.toString(), 
            //valide 1 mois
            expiresIn: 60 * 60 * 24 * 30 * 1,
            algorithm: 'RS256'               
          });
          
          return res.status(200).json({ user, token });
        } else {
          return res.status(400).json({ message: 'Mauvais email ou mot de passe!' });
        }
      } else {
        return res.status(404).json({ message: "Ce compte n'existe pas !" });
      }
    } catch (error) {
      console.error('LOGIN USER ERROR: ', error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
};

module.exports = AuthController;