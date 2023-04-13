import { Request, Response } from 'express';
import { successResponse } from '../../utils/helpers';
import RolesService from '../Services/RolesService';

const index = async (req: Request, res: Response, next: any) => {
  try {
    const rolesData = await RolesService.fetchAllRoles();

    return res.json(successResponse(rolesData.data));
  } catch (error: any) {
    return next(error);
  }
};

export default {
  index,
};
