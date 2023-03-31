/* eslint-disable no-console */
import cluster from 'cluster';
import config from 'config';
import { Application } from 'express';
import http from 'http';
import { cpus } from 'os';

function Server(app: Application) {
  const server = http.createServer(app);
  const port: number | string = config.get('PORT') || 5000; // for azure 8080 port is required

  // on local start only 1 thread
  if (process.env.NODE_ENV === 'localhost') {
    server.listen(port, () => {
      console.log(
        `${config.get('APP_NAME')} app listening on port ${port} with process id ${process.pid} on ${config.get(
          'APP_ENV',
        )} environment!`,
      );
    });
  } else {
    // on qa, stage, production start multiple thread of server
    const numCPUs: number = cpus().length; // find no of core in cpu
    if (cluster.isMaster) {
      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', () => {
        cluster.fork(); // create new process if any process is died
      });
    } else {
      server.listen(port, () => {
        console.log(`${config.get('APP_NAME')} app listening on port ${port} with process id ${process.pid}!`);
      });
    }
  }
}

export default Server;
