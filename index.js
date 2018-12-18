const gracefulShutdown = require('http-graceful-shutdown');

// defaults
const PORT = process.env.PORT || 3000;
const SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;
// const apiVersion = process.env.API_VERSION || 'v1';
// const baseUrl = `/api/${apiVersion}`;

// Add swagger server
server().then((app) => { // eslint-disable-line
  // Start the server
  const server = app.listen(PORT);
  console.log('Service listening on port %s ...', PORT); // eslint-disable-line

  // Enable graceful server shutdown when process is terminated
  gracefulShutdown(server, {
    timeout: SHUTDOWN_TIMEOUT,
  });
}).catch((er) => { // eslint-disable-line
  throw new Error(er);
});
