/* istanbul ignore file */

const cors = require('cors');
const express = require('express');
const SwaggerParser = require('swagger-parser');
const swaggerRoutes = require('swagger-routes-express');
const bodyParser = require('body-parser');
const api = require('./api');
const auth = require('./auth');

const SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';

module.exports = async function () { // eslint-disable-line

  const parser = new SwaggerParser();
  const apiDescription = await parser.validate('swagger/swagger.yml');
  const connect = swaggerRoutes(api, apiDescription);

  // Create a new express app
  const app = express();

  // Add CORS headers
  app.use(cors());

  // Add body parser
  app.use(bodyParser.json());

  // Add Authentication middleware
  app.use(auth);

  // Add health check endpoint
  app.get(SERVICE_CHECK_HTTP, (req, res) => res.send({ uptime: process.uptime() }));

  // Connect the routes
  connect(app);

  return app;
};
