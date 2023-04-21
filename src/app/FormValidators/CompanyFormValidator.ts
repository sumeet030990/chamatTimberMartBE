import Joi from 'joi';

const companyObject = {
  name: Joi.string().min(2).max(50).required(),
  allow_billing: Joi.boolean().required(),
  allow_gst_billing: Joi.boolean().required(),
  primary_contact: Joi.string().max(20).allow('', null),
  secondary_contact: Joi.string().max(20).allow('', null),
  logo_url: Joi.string().allow('', null),
  gst_no: Joi.string().max(30).allow(''),
  gst_tax_percentage: Joi.number().allow('', null),
  address: Joi.string().allow('', null),
  country_id: Joi.string().allow('', null),
  country_name: Joi.string().max(50).allow('', null),
  state_id: Joi.string().allow('', null),
  state_name: Joi.string().max(50).allow('', null),
  city_name: Joi.string().max(50).allow('', null),
  pin_code: Joi.string().max(20).allow('', null),
};

const storeRequest = Joi.object({
  ...companyObject,
}).options({ abortEarly: false });

const updateRequest = Joi.object({
  ...companyObject,
}).options({ abortEarly: false });

export { storeRequest, updateRequest };
