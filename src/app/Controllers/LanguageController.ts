import { Request, Response } from 'express';
import { successResponse } from '../../utils/helpers';
import LanguageService from '../Services/LanguageService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const rolesData = await LanguageService.fetchAllLanguages();

    return res.json(successResponse(rolesData.data));
  } catch (error: any) {
    return next(error);
  }
};

export default {
  index,
};
