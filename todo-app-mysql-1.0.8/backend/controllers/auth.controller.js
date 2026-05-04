const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/keys');
const User = require('../models/user.model');
const cleanUser = (user) => {

  const { password, ...cleanedUser } = user.toObject();
  return cleanedUser;
};

const AuthController = {
  loginUser: async (req, res) => {
    try {
      // 3. Mongoose: On enlève le "where: {}", on cherche directement le champ
      const result = await User.findOne({ email: req.body.email.toLowerCase() });

      if (result) {
        if (bcrypt.compareSync(req.body.password, result.password)) {
          const user = cleanUser(result);
          
          const token = jsonwebtoken.sign({}, JWT_SECRET, {
            // 4. Mongoose: L'identifiant est _id et non id
            subject: result._id.toString(), 
            expiresIn: 60 * 60 * 24 * 30 * 6,
            algorithm: 'RS256'
          });
          
          return res.status(200).json({ user: user, token: token });
        } else {
          return res.status(400).json({
            message: 'Mauvais email ou mot de passe!'
          });
        }
      } else {
        return res.status(404).json({
          message: "Ce compte n'existe pas !"
        });
      }
    } catch (error) {
      console.error('LOGIN USER: ', error);
      return res.status(500).json(null);
    }
  }
};

module.exports = AuthController;