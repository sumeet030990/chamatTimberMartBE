import AuthService from '../app/Services/AuthService';

const getAuthUserIdFromHeaders = (headers: any) => {
  if (headers.authorization) {
    const loggingUser: any = AuthService.verifyAccessToken(headers.authorization);

    return loggingUser.userData.id;
  }

  return null;
};

export { getAuthUserIdFromHeaders };
