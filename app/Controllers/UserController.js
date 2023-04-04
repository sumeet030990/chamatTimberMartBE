import { successResponse } from '../../utils/helpers/apiResponseFormat';
import UserService from '../Services/UserService';

const index = async (req, res, next) => {
  try {
    console.log('hi');

    return res.json(successResponse('data'));
    // const data = await UserService.fetchAllUsers(req.query);
  } catch (error) {
    return next(error);
  }
};

export default {
  index,
};
