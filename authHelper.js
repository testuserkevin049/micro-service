const jwt = require('jsonwebtoken');


// /**
//  * @param {Object} decoded decoded token object
//  * @returns {Bool} whether or not the token is stale
//  */
// exports.expiredToken = function (decoded) {
//   var { createdAt, valid } = decoded;
// };

/**
 * Decode & verify authentication token
 * @param {String} token json web token
 * @param {Object} cb callback
 */
exports.validToken = (token, cb) => { // eslint-disable-line
  try {
    jwt.verify(token, 'secret', cb);
  } catch (er) {
    cb(new Error({
      message: 'Not found or invalid token',
      error: er,
    }));
  }
};
