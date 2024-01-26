import Joi from 'joi';

const customerInfoSchema = {
  user: Joi.array().min(1).max(1).required(),
  city: Joi.string().allow('', null),
  contact_detail: Joi.string().allow('', null),
  item_type: Joi.string().required(),
  invoice_date: Joi.string().required(),
};

const itemSchema = Joi.object().keys({
  item: Joi.array().items(
    Joi.object().keys({
      value: Joi.alternatives().try(Joi.number(), Joi.string()),
      label: Joi.string().required(),
      type: Joi.string().required(),
      length: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null),
      width: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null),
      height: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null),
    }),
  ),
  size: Joi.string().allow('').required(),
  piece: Joi.string().allow('').required(),
  rate: Joi.string().allow('').required(),
  remark: Joi.string().allow('').required(),
  subItems: Joi.array().required(),
  itemTotal: Joi.string().required(),
});

const billObject = {
  customer_details: Joi.object().keys(customerInfoSchema).required(),
  total: Joi.object().required(),
  items: Joi.array().items(itemSchema).required(),
  type: Joi.string().required(),
  bill_remark: Joi.string().allow('', null),
  amount_paid: Joi.number().required(),
  payment_mode: Joi.string().allow('', null),
};

const storeRequest = Joi.object({
  ...billObject,
}).options({ abortEarly: false });

const updateRequest = Joi.object({
  ...billObject,
}).options({ abortEarly: false });

export { storeRequest, updateRequest };
