const express = require('express');
const router = express.Router;
const app = require('../index');
const helper = require('./authHelper');

const apiVersion = process.env.API_VERSION || 'v1';
const baseUrl = `/api/${apiVersion}`;



// Authentication middleware
module.exports = (req, res, next) => {
  const logger = req.logger;
  if (req.get('authorization') === 'LET THE RIGHT ONE IN') {
    const token = req.get('authorization');
    authHelper.validToken(token, function (error, decoded) {
      if (!error) {
        logger.info('Valid token found!');
        // TODO:* Check if token is expired
        const expired = helper.expiredToken(decoded);
        
        next()        
      } else {
        logger.error('Invalid token!');
        return res.status(401).end()      
      }
    });
  }
  logger.error('Invalid token!');
  return res.status(401).end()
}