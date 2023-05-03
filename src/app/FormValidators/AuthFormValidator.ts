import Joi from 'joi';

const loginRequest = Joi.object({
  // email: Joi.string().email().lowercase().required(),
  userName: Joi.string().min(2).max(100).lowercase().required(),
  password: Joi.string().min(2).max(20).required(),
}).options({ abortEarly: false });

const changePasswordRequest = Joi.object({
  password: Joi.string().min(3).max(50).required(),
}).options({ abortEarly: false });

export { loginRequest, changePasswordRequest };
