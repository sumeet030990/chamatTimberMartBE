import { Request, Response } from 'express';
import createHttpError from 'http-errors';

const cryptoKeyGenerator = require('crypto');
const fs = require('fs');

function genKeyPair() {
  // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
  const keyPair = cryptoKeyGenerator.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
    privateKeyEncoding: {
      type: 'pkcs1', // "Public Key Cryptography Standards 1"
      format: 'pem', // Most common formatting choice
    },
  });

  // Create the public key file
  fs.writeFileSync(`./src/id_rsa_pub.pem`, keyPair.publicKey);

  // Create the private key file
  fs.writeFileSync(`./src/id_rsa_priv.pem`, keyPair.privateKey);
}

const generatePublicPrivateKeys = async (req: Request, res: Response) => {
  try {
    // Generate the keypair
    genKeyPair();

    return res.json('Created Key Pair');
  } catch (error: any) {
    throw new createHttpError.UnprocessableEntity(`Issue while creating Public Private Key ${error.message}`);
  }
};

export default {
  generatePublicPrivateKeys,
};
