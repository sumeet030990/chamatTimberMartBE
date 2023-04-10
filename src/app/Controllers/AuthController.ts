import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { isNull } from 'lodash';
import { removeProtectedFieldsFromData, successResponse } from '../../utils/helpers';
import { loginRequest } from '../FormValidators/AuthFormValidator';
import AuthService from '../Services/AuthService';
import UserService from '../Services/UserService';

/**
 * Generate Access and Refresh Token for Login and Register method
 * @param userData
 * @returns
 */
const generateAccessAndRefreshToken = async (userData: any) => {
  try {
    const filteredUserData = removeProtectedFieldsFromData(userData, ['password']); // remove protected fields from user data
    if (!filteredUserData) throw new createHttpError.InternalServerError();

    const accessToken = await AuthService.createAccessToken(filteredUserData);

    return { accessToken };
  } catch (error: any) {
    throw new createHttpError.InternalServerError();
  }
};
/**
 * Post Api for login in router which generate's access and refresh token
 * @param req
 * @param res
 * @param next
 * @returns
 */
const login = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const validationResult = await loginRequest.validateAsync(req.body);
    const { userName, password } = validationResult; // ll use sanitized data after validation

    // Find User
    const userData = await UserService.fetchUserByUserName(userName, { allowLogin: false });
    if (isNull(userData)) throw new createHttpError.Unauthorized('Invalid username or password');

    // Check if Password is correct
    const isValidPassword = await AuthService.verifyPassword(userData, password);
    if (!isValidPassword) throw new createHttpError.Unauthorized('Invalid username or password');

    // Create Access and Refresh Token
    const { accessToken } = await generateAccessAndRefreshToken(userData);

    const filteredUserData = removeProtectedFieldsFromData(userData, ['password']);

    return res.json(successResponse({ accessToken, userData: filteredUserData }));
  } catch (error: any) {
    return next(error);
  }
};

export default {
  login,
};
