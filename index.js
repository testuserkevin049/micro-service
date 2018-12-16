'use strict';

const gracefulShutdown = require('http-graceful-shutdown');
const server = require('./app');

// defaults
const PORT = process.env.PORT || 3000;
const SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
const apiVersion = process.env.API_VERSION || 'v1';
const baseUrl = `/api/${apiVersion}`;


// Add swagger server
server().then(function (app) {

  // Start the server
  const server = app.listen(PORT);
  console.log('Service listening on port %s ...', PORT);

  // Enable graceful server shutdown when process is terminated
  gracefulShutdown(server, { timeout: SHUTDOWN_TIMEOUT });

}).catch(function (er) {
  throw new Error(er);
});

