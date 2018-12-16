const jwt = require('jsonwebtoken');

/**
 * Decode jwt token
 */
exports.decodeToken = function (token) {
    return jwt.decode(token);
};


exports.validToken = function (token, logger) {
    try {
        jwt.decode(token);
        return true;
    } catch (ex) {
        logger.error('ERROR: Invalid token!');
        return false;
    }
};

