const responseMessage = require('../../../helpers/responseMessageHelper');
const permissionService = require('../../../services/v1/permissionService');
const PermissionTrasform = require('../../../transforms/admin/permissionTransform');

const permissionController = {
  index: async (req, res, next) => {
    permissionService
      .index(req)
      .then((data) => {
        const result = PermissionTrasform.transformCollection(data);
        responseMessage(res, data.message, result);
      })
      .catch((err) => {
        next(err);
      });
  },

  store: async (req, res, next) => {
    permissionService
      .store(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  show: async (req, res, next) => {
    permissionService
      .show(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },

  destory: async (req, res, next) => {
    permissionService
      .delete(req)
      .then((data) => {
        responseMessage(res, data.message, data.data);
      })
      .catch((err) => {
        next(err);
      });
  },
};

module.exports = permissionController;
