const jsonPatch = require('jsonpatch');

module.exports = {

  /**
   * Apply patch to json object
   * @param {Object} req request
   * @param Object} res response
   */
  patchJson: (req, res) => {
    const logger = req.logger; // eslint-disable-line

    try {
      const json = req.body.json; // eslint-disable-line
      const patch = req.body.patch; // eslint-disable-line
      const patchedJson = jsonPatch.apply_patch(json, [patch]);

      res.json(patchedJson).end();
    } catch (er) {
      logger.debug(er);
      res.sendStatus(500).end();
    }
  },

};
