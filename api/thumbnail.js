const fs = require('fs');
const Path = require('path');
const axios = require('axios');
const jimp = require('jimp');
const authHelper = require('../authHelper');

let logger;

/**
 * Find the users directory
 * @param {string} token authentication token
 */
function findUserDirectory(token) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    authHelper.validToken(token, (er, decoded) => { // eslint-disable-line
      if (er) {
        reject(er);
      }
      const { username } = decoded;
      if (username === 'testuser') {
        resolve({
          dir: Path.join(__dirname, '../data/test'),
        });
      }
      resolve({
        dir: Path.join(__dirname, `../data/${username}`),
      });
    });
  });
}

/**
 * Strip out the file name from the thumbnail path
 * @param {String} path Thumbnail path
 */
function stripThumbnailName(path) { // eslint-disable-line
  const name = path.replace(/^(.*)\//, '');
  return name;
}

/**
 * Resize thumbnail
 * @param {String} path local image path
 */
function resizeImg(path) {
  return new Promise(function (resolve, reject) { // eslint-disable-line
    const downloadPath = path;
    const base = downloadPath.replace(stripThumbnailName(path), '');
    const newDownloadPath = `${base}new-${stripThumbnailName(path)}`;
    jimp.read(downloadPath).then((thumbnail) => { // eslint-disable-line
      logger.debug('resizing thumbnail ... ');
      logger.debug(`new location ==> ${newDownloadPath}`);
      thumbnail
        .resize(50, 50) // 50x50 pixel
        .quality(100)
        .write(newDownloadPath)
        .getBuffer('application/octet-stream', () => { // eslint-disable-line
          resolve(newDownloadPath);
        });
    })
      .catch((er) => { reject(new Error(er)); });
  });
}

/**
 * Download thumbnail
 * @param {String} dir Unique user directory
 * @param {String} path Public image path
 * @returns {Object} Resized image blob
 */
function downloadThumbnail(dir, path) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    const fileName = stripThumbnailName(path);
    const downloadPath = `${dir}/${fileName}`;
    logger.debug(downloadPath);
    logger.debug(path);
    try {
      axios({ url: path, responseType: 'stream' }).then((response) => { // eslint-disable-line
        logger.debug('image downloaded !');
        logger.debug(downloadPath);
        response.data.pipe(fs.createWriteStream(downloadPath)
          .on('close', () => { // eslint-disable-line
            resolve(downloadPath);
          }));
      }).catch(error => ({ status: false, error: `Error: ${error.message}` }));
    } catch (er) {
      reject(er);
    }
  });
}

/**
 * Resize an image thumbnail
 * @param {Object} req the request
 * @param {Object} res the reponse
 */
module.exports.resize = (req, res) => {
  logger = req.logger; // eslint-disable-line
  let token = req.get('authorization'); // eslint-disable-line
  token = token.replace('Bearer ', '');
  const { path } = req.body;
  // Find user directory
  findUserDirectory(token)
    .then(({ dir }) => {
      logger.debug('downloading thumbnail');
      // Download the thumbnail
      downloadThumbnail(dir, path)
        .then((downloadPath) => {
          logger.debug('thumbnail downloaded, resizeing ... ');
          // resize thumbnail
          resizeImg(downloadPath)
            .then((newDownloadPath) => {
              logger.debug('sending resized thumbnail');
              logger.debug(newDownloadPath);
              fs.readFile(newDownloadPath, function (err, data) { // eslint-disable-line
                if (err) {
                  throw new Error(err);
                }
                res.contentType('image/png');
                res.send(data);
                res.end();
              });
            })
            .catch((er) => {
              logger.debug(er);
              throw new Error(er);
            });
        })
        .catch((er) => {
          logger.debug(er);
          res.sendStatus(500, 'Error: Could not find specified user').end();
        });
    })
    .catch(() => {
      res.sendStatus(500).end();
    });
};
