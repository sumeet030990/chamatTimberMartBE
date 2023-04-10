import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import AuthService from '../Services/AuthService';
// import CacheService from '../Services/CacheService';

/**
 * Check if user is authenticated or not
 * via passport jwt-strategy
 * @param req
 * @param res
 * @param next
 */
const protectedRoutes = (req: Request, res: Response, next: any) => {
  try {
    if (req.headers.authorization) {
      const user = AuthService.verifyAccessToken(req.headers.authorization);
      if (user) {
        return next(); // no error then proceed
      }
    }
    next(new createHttpError.Unauthorized());
  } catch (error: any) {
    next(new createHttpError.Unauthorized(error.message));
  }
};

export default protectedRoutes;
