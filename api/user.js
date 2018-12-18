const jwt = require('jsonwebtoken');


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
   * Login user
   * @param {Object} req request
   * @param {Object} res response
   */
  loginUser: (req, res) => {
    const username = req.body.username; // eslint-disable-line
    const password = req.body.password; // eslint-disable-line
    const token = jwt.sign({
      username,
      password,
    }, 'secret');

    res.send({ token }).end();
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
