const Joi = require('joi');

module.exports = {
  permissionSchema: {
    store: Joi.object({
      name: Joi.string().email().optional(),
      group: Joi.string().required().messages({
        'string.base': 'name_must_be_string',
        'any.required': 'name_required',
        'string.empty': 'name_not_empty',
      }),
    }),
  },
  roleSchema: {
    store: Joi.object({
      name: Joi.string().required().messages({
        'string.base': 'name_must_be_string',
        'any.required': 'name_required',
        'string.empty': 'name_not_empty',
      }),
      permissions: Joi.array().items(Joi.number()).required().messages({
        'array.base': 'permissions_must_array',
        'array.includes': 'permissions_must_valid',
        'any.required': 'permissions_required',
      }),
    }),
  },
  adminSchema: {
    store: Joi.object({
      name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'name_must_be_string',
        'any.required': 'name_required',
        'string.empty': 'name_not_empty',
        'string.min': 'name_min_length',
        'string.max': 'name_max_length',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'email_must_valid',
        'string.empty': 'email_not_empty',
        'any.required': 'email_required',
      }),
      phone: Joi.string().min(7).max(11).required().messages({
        'string.empty': 'phone_not_empty',
        'any.required': 'phone_required',
        'string.min': 'phone_min_length',
        'string.max': 'phone_max_length',
      }),
      password: Joi.string().min(8).max(30).optional().messages({
        'string.base': 'name_must_be_string',
        'string.empty': 'password_not_empty',
        'any.required': 'password_required',
        'string.min': 'password_min_length',
        'string.max': 'password_max_length',
      }),
      roles: Joi.array().items(Joi.number()).required().messages({
        'array.base': 'roles_must_array',
        'array.includes': 'roles_must_valid',
        'any.required': 'roles_required',
      }),
      routes: Joi.array().items(Joi.number()).required().messages({
        'array.base': 'routes_must_array',
        'array.includes': 'routes_must_valid',
        'any.required': 'routes_required',
      }),
    }),
  },
};
