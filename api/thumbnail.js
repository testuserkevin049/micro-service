const fs = require('fs');
const request = require('request');
const jimp = require('jimp');
const authHelper = require('../authHelper');


/**
 * Find the users directory
 * @param {string} token authentication token
 */
function findUserDirectory(token) {
  authHelper.validToken(token, (decoded) => { // eslint-disable-line
    const { username } = decoded;
    return {
      dir: `../data/${username}`,
    };
  });
}

/**
 * Get the thumbnail file
 * @param {String} name thumbnail file name
 * @param {String} path thumbnail file path
 * @returns {Object} the thumbnail blob
 */
async function findThumbnail(path) {
  // TODO:* Return a blob object.
  return fs.readFile(path).then((er, buffer) => {
    if (er) {
      throw new Error(er);
    }
    return new Blob(buffer, { // eslint-disable-line
      // name: name,
      type: 'application/octet-stream',
    });
  });
}

/**
 * Resize thumbnail
 * @param {String} path image path
 */
async function resizeImg(path) {
  return jimp.read(path).then((err, thumbnail) => { // eslint-disable-line

    if (err) {
      throw new Error(err);
    }

    console.log('[jimp thumbnail object] DEBUG: See if you can find the blob to send the response.'); // eslint-disable-line
    console.log(thumbnail); // eslint-disable-line

    return thumbnail
      .resize(50, 50) // 50x50 pixel
      .quality(100) // lossless
      .write(path); // TODO:* Rewriting the same file could bring a problem
  })
    .catch((er) => { throw new Error(er); });
}

/**
 * Download image path
 * @param {String} dir Unique user directory
 * @param {String} path Public image path
 * @returns {Object} Resized image blob
 */
async function downloadThumbnail(dir, path) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    const downloadPath = `${dir}/${path}`;
    try {
      request(path).pipe(fs.createWriteStream(`${dir}/${path}`)
        .then((er) => {
          if (er) {
            throw new Error(er);
          }
          resolve(downloadPath);
        }));
    } catch (er) {
      reject(er);
    }
  });
}

/**
 * Resive an image thumbnail
 * @param {Object} req the request
 * @param {Object} res the reponse
 */
module.exports.resize = async (req, res) => {
  const logger = req.logger; // eslint-disable-line
  const token = req.get('authorization'); // eslint-disable-line
  const { path } = req.body.thum;
  const { dir } = await findUserDirectory(token);

  logger.debug('downloading thumbnail');

  downloadThumbnail(dir, path)
    .then(async (downloadPath) => {
      logger.debug('thumbnail downloaded, resizeing ... ');
      await resizeImg(downloadPath);
      logger.debug('thumbnail resized, getting thumbnail ... ');
      const img = await findThumbnail(downloadPath);
      logger.debug('thumbnail found, sending response ... ');
      res.sendFile(img).end();
    })
    .catch((er) => {
      logger.debug(er);
      res.send(500, 'Error: Could not find specified user').end();
    });
};
