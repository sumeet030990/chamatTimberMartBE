import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isUndefined } from 'lodash';
import AuthService from '../Services/AuthService';

/**
 * Check if user is accessing the data of company with access to it or not
 * via passport jwt-strategy
 * @param req
 * @param res
 * @param next
 */
const companyAccessCheck = (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const { selectedCompany } = reqQuery;
    if (req.headers.authorization) {
      const user: any = AuthService.verifyAccessToken(req.headers.authorization);
      const hasCompanyAccess = user.userData.users_company.find((company: any) => {
        return company.value === parseInt(selectedCompany);
      });
      if (!isUndefined(hasCompanyAccess)) {
        return next(); // no error then proceed
      }
    }
    next(new createHttpError.InternalServerError('You are not authorize to access this company data'));
  } catch (error: any) {
    next(new createHttpError.InternalServerError(error.message));
  }
};

export default companyAccessCheck;
