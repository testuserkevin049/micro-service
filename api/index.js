const {
  getUserDetails, createUser, loginUser, updateUser, deleteUser,
} = require('./user');
const {
  patchJson,
} = require('./jsonPatch');
const {
  resize,
} = require('./thumbnail');


module.exports = {
  loginUser,
  createUser,
  getUserDetails,
  updateUser,
  deleteUser,
  patchJson,
  resize,
};
