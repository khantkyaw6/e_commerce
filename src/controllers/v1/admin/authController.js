const responseMessage = require('../../../helpers/responseMessageHelper');
const authService = require('../../../services/v1/authService');

const authController = {
  login: async (req, res, next) => {
    authService
      .login(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
  logout: async (req, res, next) => {
    authService
      .logout(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = authController;
