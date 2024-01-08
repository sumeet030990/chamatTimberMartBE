import bcrypt from 'bcrypt';
import fs from 'fs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import path from 'path';
import { ACCESS_TOKEN_EXPIRES_IN } from '../../utils/constant';
import UserRepository from '../Repositories/UserRepository';

const fileDir = path.join(__dirname, '../../');

/**
 * Hash password string
 * @param incomingPassword
 * @returns string
 */
const hashedPassword = async (incomingPassword: string) => {
  if (incomingPassword) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(incomingPassword, salt);

    return password;
  }
};

/**
 * Compare hash Password with the password
 * @param userData
 * @param password
 * @returns boolean
 */
const verifyPassword = async (userData: any, password: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, userData.password);
  } catch (error: any) {
    throw new createHttpError.InternalServerError(error.message);
  }
};

/**
 * Create Access Token with the help of Public Private key
 *
 * @param userData User
 * @returns string
 */
const createAccessToken = (userData: any): Promise<string | undefined> => {
  const privateKey = fs.readFileSync(`${fileDir}/id_rsa_priv.pem`, { encoding: 'utf8' });

  return new Promise((resolve, reject) => {
    const payload = { userData };
    try {
      jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_EXPIRES_IN }, (err, token) => {
        if (err || isEmpty(token)) return reject(new createHttpError.InternalServerError());

        return resolve(token);
      });
    } catch (error: any) {
      throw new createHttpError.InternalServerError('Oops Something went wrong');
    }
  });
};

const verifyAccessToken = (token: string) => {
  try {
    const publicKey = fs.readFileSync(`${fileDir}/id_rsa_pub.pem`, { encoding: 'utf8' });
    const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    return payload;
  } catch (error) {
    throw new createHttpError.Unauthorized();
  }
};

const changePassword = async (userId: string, password: string) => {
  try {
    const hashed = await hashedPassword(password);

    if (hashed) {
      return UserRepository.changePassword(userId, hashed);
    }
  } catch (error: any) {
    throw new createHttpError.UnprocessableEntity(error.message);
  }
};

export default {
  hashedPassword,
  verifyPassword,
  createAccessToken,
  verifyAccessToken,
  changePassword,
};
