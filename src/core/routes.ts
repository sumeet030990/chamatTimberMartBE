import { Application, Request, Response } from 'express';
import createError from 'http-errors';
// import LoggerService from '../app/Services/LoggerService';
import apiRoutes from '../routes/api';
import webRoutes from '../routes/web';
import { errorResponse } from '../utils/helpers';

const routes = (app: Application) => {
  app.use('/api', apiRoutes);
  app.use('', webRoutes);

  // Catch all undefine routes
  app.use(async (req: Request, res: Response, next: any) => {
    next(new createError.NotFound('This route does not exists'));
  });

  // Error handle Middleware
  // eslint-disable-next-line no-unused-vars
  app.use(async (err: any, req: Request, res: Response, next: any) => {
    if (err.isJoi) {
      // if there is validation error
      const errorMessage = err.message.split('.');
      res.status(422);

      return res.send(errorResponse(errorMessage, 422));
    }
    const errorStatus = err.status || 500;

    // await LoggerService.logErrorInDb(errorResponse(err.message, errorStatus), req.user);

    res.status(err.status || 500);

    return res.send(errorResponse(err.message, errorStatus));
  });
};

export default routes;
