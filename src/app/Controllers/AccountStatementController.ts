import { Request, Response } from 'express';
import { successResponse } from '../../utils/helpers';
import AccountStatementService from '../Services/AccountStatementService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const reqQuery: any = req.query;
    const rolesData = await AccountStatementService.fetchAllAccountStatements(reqQuery);

    return res.json(successResponse(rolesData));
  } catch (error: any) {
    return next(error);
  }
};

export default {
  index,
};
