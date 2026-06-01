const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no puede superar los 255 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),
  description: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'La descripción no puede superar los 2000 caracteres',
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'El precio debe ser mayor a 0',
    'any.required': 'El precio es obligatorio',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.integer': 'El stock debe ser un número entero',
    'number.min': 'El stock no puede ser negativo',
    'any.required': 'El stock es obligatorio',
  }),
  category: Joi.string().max(100).optional().allow(''),
  artist: Joi.string().max(255).optional().allow(''),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(2000).optional().allow(''),
  price: Joi.number().positive().precision(2).optional(),
  stock: Joi.number().integer().min(0).optional(),
  image_url: Joi.string().uri().max(1024).optional().allow(''),
  category: Joi.string().max(100).optional().allow(''),
  artist: Joi.string().max(255).optional().allow(''),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});

module.exports = { createProductSchema, updateProductSchema };
