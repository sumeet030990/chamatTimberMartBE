import Joi from 'joi';

const loginRequest = Joi.object({
  // email: Joi.string().email().lowercase().required(),
  userName: Joi.string().min(2).max(100).lowercase().required(),
  password: Joi.string().min(2).max(20).required(),
}).options({ abortEarly: false });

export { loginRequest };
