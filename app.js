
const cors = require('cors');
const express = require('express');
const SwaggerParser = require('swagger-parser');
const swaggerRoutes = require('swagger-routes-express');
const bodyParser = require('body-parser');
const winston = require('winston');
const api = require('./api');
const authHelper = require('./authHelper');

const SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';


module.exports = async function () { // eslint-disable-line

  const parser = new SwaggerParser();
  const apiDescription = await parser.validate('swagger/swagger.yml');
  const connect = swaggerRoutes(api, apiDescription);
  // logger
  const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
      new winston.transports.Console({ level: 'debug' }),
      new winston.transports.File({
        filename: 'combined.log',
        level: 'debug',
      }),
    ],
  });

  // Create a new express app
  const app = express();

  // Add CORS headers
  app.use(cors());

  // Add body parser
  app.use(bodyParser.json());

  // Add Authentication middleware
  app.use((req, res, next) => { // eslint-disable-ling
    req.logger = logger;

    try {
      const token = req.get('authorization');
      const authUrl = req.url.replace('/api/v1/', '').match(/delete|json|patch/).length > 0;
      if (authUrl) {
        authHelper.validToken(token, (error, decoded) => { // eslint-disable-line
          logger.debug(decoded);
          if (decoded) {
            next();
          }
          if (error) {
            logger.debug('Not found or invalid token');
            res.sendStatus(401).end();
          }
        });
      }
    } catch (er) {
      const noAuthUrl = req.url.replace('/api/v1/', '').match(/login|user/).length > 0;
      if (noAuthUrl) {
        next();
      }
      throw new Error(er);
    }
  });

  // Add health check endpoint
  app.get(SERVICE_CHECK_HTTP, (req, res) => res.send({ uptime: process.uptime() }));

  // Add all other service routes
  app.get('/', (req, res) => res.send('Hello World'));

  // Connect the routes
  connect(app);

  return app;
};
