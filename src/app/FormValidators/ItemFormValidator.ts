import Joi from 'joi';

const itemObject = {
  name: Joi.string().required(),
  item_code: Joi.string().required(),
  item_type: Joi.string().required(),
  status: Joi.boolean().required(),
};

const storeRequest = Joi.object({
  ...itemObject,
}).options({ abortEarly: false });

export { storeRequest };
