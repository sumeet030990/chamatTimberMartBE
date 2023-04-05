import config from 'config';
import cors from 'cors';
import { Application } from 'express';
import morgan from 'morgan';

const middleware = (app: Application, express: any) => {
  app.use(express.static('./public')); // all the files inside the folder can be accessed by URl: {{url}}/fileName
  app.use(
    cors({
      origin: config.get('FE_URL'),
    }),
  );
  app.use(express.json()); // required when we want to access request body data
  // app.use(express.urlencoded({ extends: true })); // required when client is using form url encoded data

  app.use(morgan('tiny'));
};

export default middleware;
