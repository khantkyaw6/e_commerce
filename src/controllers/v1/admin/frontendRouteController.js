const responseMessage = require('../../../helpers/responseMessageHelper');
const frontendRouteService = require('../../../services/v1/frontendRouteService');

const frontendRouteController = {
  index: async (req, res, next) => {
    frontendRouteService
      .index(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  store: async (req, res, next) => {
    frontendRouteService
      .store(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  show: async (req, res, next) => {
    frontendRouteService
      .show(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  update: async (req, res, next) => {
    frontendRouteService
      .update(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  destory: async (req, res, next) => {
    frontendRouteService
      .delete(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = frontendRouteController;
