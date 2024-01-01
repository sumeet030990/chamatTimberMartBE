import Joi from 'joi';
import { CREDIT, DEBIT } from '../../utils/constant';

const transactionObject = {
  user_id: Joi.number().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid(CREDIT, DEBIT).required(),
  date: Joi.date().required(),
  payment_mode: Joi.string().valid('cash', 'bank_transfer', 'upi_payment').required(),
  company_id: Joi.number().required(),
  note: Joi.string().allow(''),
};

const storeRequest = Joi.object({
  ...transactionObject,
}).options({ abortEarly: false });

export { storeRequest };
