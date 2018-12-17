const { getUserDetails, createUser, loginUser, updateUser, deleteUser } = require('./user');
const { patchJson } = require('./jsonPatch');


module.exports = {
    loginUser,
    createUser,
    getUserDetails,
    updateUser,
    deleteUser,
    patchJson
};
