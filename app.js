
const cors = require('cors');
const express = require('express')
const SwaggerParser = require('swagger-parser')
const swaggerRoutes = require('swagger-routes-express')
const winston = require('winston');
const api = require('./api')
const authHelper = require('./authHelper');

const SERVICE_CHECK_HTTP = process.env.SERVICE_CHECK_HTTP || '/healthcheck';


module.exports = async function () {

    const parser = new SwaggerParser()
    const apiDescription = await parser.validate('swagger/swagger.yml')
    const connect = swaggerRoutes(api, apiDescription)
    // logger
    const logger = winston.createLogger({
        levels: winston.config.syslog.levels,
        transports: [
            new winston.transports.Console({ level: 'error' }),
            new winston.transports.File({
                filename: 'combined.log',
                level: 'info'
            })
        ]
    });

    // Create a new express app
    const app = express()

    // Add CORS headers
    app.use(cors());

    // Add Authentication middleware
    app.use(function (req, res, next) {
        req.logger = logger;
        const token = req.get('authorization');
        const validToken = authHelper.validToken(token);
        if (validToken) {
            next();
        }
    });

    // Add health check endpoint
    app.get(SERVICE_CHECK_HTTP, (req, res) => res.send({ uptime: process.uptime() }));

    // Add all other service routes
    app.get('/', (req, res) => res.send('Hello World'));

    // Connect the routes
    connect(app)

    return app

};
