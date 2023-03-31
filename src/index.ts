import dotenv from 'dotenv';
import express, { Application } from 'express';
import initialChecks from './core/initialChecks';
import middleware from './core/middleware';
import routes from './core/routes';
import server from './core/server';

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
dotenv.config();

const app: Application = express();

// intital checks -  check for necessary information which are required to run app
initialChecks();

// Add all middleware
middleware(app, express);

// Imports all of the routes from ./routes/index.js
routes(app);

// Configure and Start Server
server(app);
