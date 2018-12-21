const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {


  /**
   * Get user details
   * @param {Object} req request
   * @param {Object} res response
   */
  getUserDetails: (req, res) => {
    const logger = req.logger; // eslint-disable-line
    logger.info('success getting user details');
    res.send('Success').end();
  },

  /**
   * Create a new unique directory to store downloaded files
   * @param {String} username unique username
   */
  createUserDirectory: (username) => { // eslint-disable-line
    return new Promise((resolve, reject) => { // eslint-disable-line
      fs.mkdir(`../data/${username}`, (er) => {
        if (!er) {
          resolve();
        }
        // TODO:* Test this
        // if (er === 'directory exist') {
        //   resolve();
        // }
        reject();
      });
    });
  },

  /**
   * Login user
   * @param {Object} req request
   * @param {Object} res response
   */
  loginUser: (req, res) => {
    const logger = req.logger; // eslint-disable-line
    if (req.body.username != undefined && req.body.password != undefined) {
    //   res.sendStatus(200).end();
    // } else {
    //   res.sendStatus(500).end();
    // }

      const username = req.body.username; // eslint-disable-line
      const password = req.body.password; // eslint-disable-line
      const token = jwt.sign({
        username,
        password,
      }, 'secret');

      res.send({ token }).end();
    } else {
      res.sendStatus(400).end();
    }
    // this.createUserDirectory(username)
    //   .then(() => res.send({ token }).end())
    //   .catch((er) => {
    //   logger.debug(er);
    //   res.status(500);
    //   res.send('Error: Could not create user directory. Have you registered the user.').end();
    // });
  },


  /**
   * Create new user
   * @param {Object} req request
   * @param {Object} res response
   */
  createUser: (req, res) => {
    const user = req.body;
    const token = jwt.sign({
      user,
    });
    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      credentails: {
        createdAt: Date.now.toString('dd:mm:yyyy'),
        expiresAt: '',
        token,
      },
      createdAt: Date.now.toString('dd:mm:yyyy'),
      updatedAt: Date.now.toString('dd:mm:yyyy'),
      updatedBy: user.username,
    });
    res.end();
  },


  /**
   * Update user details
   * @param {Object} req request
   * @param {Object} res response
   */
  updateUser: (req, res) => {
    res.send('Success');
  },

  /**
   * Remove user
   * @param {Object} req request
   * @param {Object} res response
   */
  deleteUser: (req, res) => {
    res.send('Success');
  },


};
