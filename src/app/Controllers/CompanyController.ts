import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { successResponse } from '../../utils/helpers';
import { storeRequest, updateRequest } from '../FormValidators/CompanyFormValidator';
import CompanyService from '../Services/CompanyService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    let data: any = [];

    if (reqQuery.forDropdown) {
      data = await CompanyService.fetchAllCompaniesDataForDropdown();
    } else {
      data = await CompanyService.fetchAllCompanies(reqQuery);
    }

    return res.json(successResponse(data));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Get Details of the Company of given id
 * @param req
 * @param res
 * @param next
 */
const show = async (req: Request, res: Response, next: any) => {
  try {
    const companyData = await CompanyService.findById(req.params.id);

    return res.json(successResponse(companyData));
  } catch (error: any) {
    return next(error);
  }
};

/**
 * Post api for Storing Company in DB
 * @param req Request
 * @param res Response
 * @param next
 * @returns Response
 */
const store = async (req: Request, res: Response, next: any) => {
  try {
    const validationResult = await storeRequest.validateAsync(req.body);

    // save user data
    const savedCompany = await CompanyService.storeCompany(validationResult);

    return res.json(successResponse({ savedCompany }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};

/**
 * Update the data of the id given
 * @param req
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: any) => {
  try {
    const { body, params } = req;
    const validateData = await updateRequest.validateAsync(body);

    const updateCompany = await CompanyService.updateCompany(params.id, validateData);

    return res.json(successResponse(updateCompany));
  } catch (error: any) {
    next(error);
  }
};

/**
 * Delete Company from DB
 *
 * @param req Request
 * @param res Response
 * @param next any
 * @returns Response
 */
const destroy = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const { id } = req.params;
    const result = await CompanyService.deleteCompany(id);

    return res.json(successResponse({ result }));
  } catch (error: any) {
    return next(new createHttpError.InternalServerError(error.message));
  }
};
export default {
  index,
  show,
  store,
  update,
  destroy,
};
