import Joi from 'joi';

const userObject = {
  name: Joi.string().min(2).max(50).required(),
  user_name: Joi.string().min(2).max(50).allow(''),
  email_id: Joi.string().max(50).allow(''),
  allow_login: Joi.boolean().required(),
  role_id: Joi.number().required(),
  language_id: Joi.number().required(),
  primary_contact: Joi.string().max(20).allow('', null),
  secondary_contact: Joi.string().max(20).allow('', null),
  date_of_birth: Joi.date().allow('', null),
  anniversary_date: Joi.date().allow('', null),
  gst_no: Joi.string().max(30).allow(''),
  gst_type: Joi.string().max(30).allow('', null),
  address: Joi.string().allow('', null),
  country_id: Joi.string().allow('', null),
  country_name: Joi.string().max(50).allow('', null),
  state_id: Joi.string().allow('', null),
  state_name: Joi.string().max(50).allow('', null),
  city_name: Joi.string().max(50).allow('', null),
  pin_code: Joi.string().max(20).allow('', null),
  companies: Joi.array().min(1),
  user_bank_details: Joi.array(),
};

const storeRequest = Joi.object({
  ...userObject,
  password: Joi.string().min(3).max(50).required(),
}).options({ abortEarly: false });

const updateRequest = Joi.object({
  ...userObject,
}).options({ abortEarly: false });

const updatePasswordRequest = Joi.object({
  password: Joi.string().min(3).max(20),
});
export { storeRequest, updateRequest, updatePasswordRequest };
