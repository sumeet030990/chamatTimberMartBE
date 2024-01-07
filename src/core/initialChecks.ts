import fs from 'fs';
import path from 'path';

/**
 * check if public and private is present or not
 * To generate keys use command in console
 * node src/utils/generatePublicPrivateKeys.ts
 * from project root directory
 */
const checkForPublicPrivateKeys = () => {
  const fileDir = path.join(__dirname, '../');
  const privateKey = fs.existsSync(`${fileDir}/id_rsa_priv.pem`);
  const publicKey = fs.existsSync(`${fileDir}/id_rsa_pub.pem`);

  if (!privateKey && !publicKey) {
    // eslint-disable-next-line no-console
    console.error('Public or Private key is not present. Stopping the app!!');
    process.exit(0);
  }
};

const checkForAccessTokenSecretKey = () => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    // eslint-disable-next-line no-console
    console.error('Access Token Secret key is not present. Stopping the app!!');
    process.exit(0);
  }
};

/**
 * Check if essential directories are present
 * for eg: public, uploads, signage:  where files are uploaded
 */
const checkForUploadDirectories = () => {
  // check for public folder(all the uploads are kept in public)
  fs.access('./public', error => {
    if (error) {
      fs.mkdirSync('./public');
    }
  });

  // check for public/uploads folder(all the product images are kept here)
  fs.access('./public/uploads', error => {
    if (error) {
      fs.mkdirSync('./public/uploads');
    }
  });
};
// check for necessary information which are required to run app
const initialChecks = () => {
  checkForPublicPrivateKeys(); // check if public and private is present or not
  checkForAccessTokenSecretKey(); // check if refresh token is exist
  checkForUploadDirectories(); //  check for important directories are available or not
};

export default initialChecks;
