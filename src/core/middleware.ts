import config from 'config';
import cors from 'cors';
import { Application, Request, Response } from 'express';
import { mapKeys, snakeCase } from 'lodash';

const middleware = (app: Application, express: any) => {
  app.use(express.static('./public')); // all the files inside the folder can be accessed by URl: {{url}}/fileName
  app.use(
    cors({
      origin: config.get('FE_URL'),
    }),
  );
  app.use(express.json()); // required when we want to access request body data

  // app.use(express.urlencoded({ extends: true })); // required when client is using form url encoded data

  // Convert Api keys to Snake Case
  // eslint-disable-next-line no-unused-vars
  app.use((req: Request, res: Response, next: any) => {
    req.body = mapKeys(req.body, (value, keys) => {
      if (keys === 'd365_id') {
        return keys;
      }

      return snakeCase(keys);
    });
    next();
  });
};

export default middleware;
