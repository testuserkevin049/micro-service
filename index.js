const gracefulShutdown = require('http-graceful-shutdown');
const server = require('./app');

// defaults
const PORT = process.env.PORT || 3000;
const SHUTDOWN_TIMEOUT = process.env.SHUTDOWN_TIMEOUT || 10000;

// Add swagger server
server().then((app) => { // eslint-disable-line
  // Start the server
  const App = app.listen(PORT);
  console.log('Service listening on port %s ...', PORT); // eslint-disable-line

  // Enable graceful server shutdown when process is terminated
  gracefulShutdown(App, {
    timeout: SHUTDOWN_TIMEOUT,
  });
}).catch((er) => { // eslint-disable-line
  throw new Error(er);
});
