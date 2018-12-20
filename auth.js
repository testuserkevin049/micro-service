const winston = require('winston');
const authHelper = require('./authHelper');

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

// Authentication middleware
module.exports = (req, res, next) => {
  req.logger = logger;

  try {
    const authUrl = req.url.replace('/api/v1/', '').match(/delete|json|patch|thumbnail/).length > 0;
    let token = req.get('authorization');
    token = token.replace('Bearer ', '');
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
    try {
      const noAuthUrl = req.url.replace('/api/v1/', '').match(/login|user/).length > 0;
      if (noAuthUrl) {
        next();
      }
    } catch (err) {
      logger.debug(err);
      res.send(500).end();
    }
  }
};
