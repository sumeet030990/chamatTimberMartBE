import Joi from 'joi';

const itemObject = {
  name: Joi.string().required(),
  length: Joi.number().required().allow('', null),
  width: Joi.number().required().allow('', null),
  height: Joi.number().required().allow('', null),
  item_code: Joi.string().required(),
  item_type: Joi.string().required(),
  status: Joi.boolean().required(),
};

const storeRequest = Joi.object({
  ...itemObject,
}).options({ abortEarly: false });

export { storeRequest };
