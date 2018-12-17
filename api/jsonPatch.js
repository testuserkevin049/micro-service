var jsonPatch = require('jsonpatch');


module.exports = {
  

  /**
   * Apply patch to json object
   * @param {Object} req request 
   * @param Object} res response
   */
  patchJson: function (req, res) {
    const json = req.body.json;
    const patch = req.body.patch;
    const patchedJson = jsonPatch.apply_patch(json, patch);
    res.json(patchedJson).end();
  }

};
