const jwt = require('jsonwebtoken');


module.exports = {


  /**
   * Get user details
   * @param {Object} req request
   * @param {Object} res response
   */
  getUserDetails: function (req, res) {
    const logger = req.logger;
    logger.info('success getting user details');
    res.send('Success').end();;
  },


  /**
   * Login user
   * @param {Object} req request
   * @param {Object} res response
   */
  loginUser: function (req, res) {

    const token =  req.get('authorization');
    const username = req.body.username;
    const password = req.body.password;

    res.send('success').end()
  },


  /**
   * Create new user
   * @param {Object} req request
   * @param {Object} res response
   */
  createUser: function (req, res) {
    console.log()
    const user = req.body;
    const token = jwt.sign({
      user
    });
  
    res.json({
      firstname: user.firstname,
      lastname: lastname,
      username: user.username,
      email: user.email,
      credentails: {
        createdAt: Date.now.toString('dd:mm:yyyy'),
        expiresAt: '',
        token
      },
      createdAt: Date.now.toString('dd:mm:yyyy'),
      updatedAt: Date.now.toString('dd:mm:yyyy'),
      updatedBy: username
    });
    res.end();
  },


  /**
   * Update user details
   * @param {Object} req request
   * @param {Object} res response
   */
  updateUser: function (req, res) {

    res.send('Success');
  },
  

  /**
   * Remove user
   * @param {Object} req request
   * @param {Object} res response
   */
  deleteUser: function (req, res) {

    res.send('Success');
  }


};
