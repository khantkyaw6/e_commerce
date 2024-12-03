require('dotenv').config();
const { JWT_SECRET, ACCESS_TOKEN_EXPIRE } = process.env;

module.exports = {
  token_secret: JWT_SECRET,
  token_expiresIn: ACCESS_TOKEN_EXPIRE,
};
