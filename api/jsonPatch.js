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
      const { json, patch } = req.body;
      const patchedJson = jsonPatch.apply_patch(json, [patch]);

      res.json(patchedJson).end();
    } catch (er) {
      logger.debug(er);
      res.sendStatus(500).end();
    }
  },

};
