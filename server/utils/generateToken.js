const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports.generateToken = generateToken