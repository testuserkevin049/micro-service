// const fs = require('fs');
const Path = require('path');
// const request = require('request');
const jimp = require('jimp');
const authHelper = require('../authHelper');

let logger;

/**
 * Find the users directory
 * @param {string} token authentication token
 */
function findUserDirectory(token) {
  return new Promise((resolve) => { // eslint-disable-line
    authHelper.validToken(token, (er, decoded) => { // eslint-disable-line
      if (er) {
        throw new Error(er);
      }
      const { username } = decoded;
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
  let name = ''; // eslint-disable-line

  return name;
}

// /**
//  * Get the thumbnail file
//  * @param {String} name thumbnail file name
//  * @param {String} path thumbnail file path
//  * @returns {Object} the thumbnail blob
//  */
// function findThumbnail(path) {
//   return new Promise(function (resolve, reject) {
//     resolve();
//   });
//   // return new Promise(function (resolve, reject) {
//   //   fs.readFile(`${path}/googlelogo-new.png`).then((er, buffer) => {
//   //     if (er) {
//   //       logger.debug(er);
//   //       reject(new Error(er));
//   //     }
//   //     resolve(new Blob(buffer, { // eslint-disable-line
//   //       type: 'application/octet-stream',
//   //     }));
//   //   });
//   // });
// }

/**
 * Resize thumbnail
 * @param {String} path local image path
 */
function resizeImg(path) {
  // TODO:* Make use of this method.
  const name = stripThumbnailName(path); // eslint-disable-line
  return new Promise(function (resolve, reject) { // eslint-disable-line
    logger.debug('resizing ...');
    const downloadPath = `${path}/googlelogo.png`;
    const newDownloadPath = `${path}/googlelogo-new.png`;
    jimp.read(downloadPath).then((thumbnail) => { // eslint-disable-line
      logger.debug('found thumbnail applying ... ');
      thumbnail
        .resize(50, 50) // 50x50 pixel
        .quality(100)
        .write(newDownloadPath)
        .getBuffer('application/octet-stream', (buffer) => { // eslint-disable-line
          resolve(buffer);
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
function downloadThumbnail(dir) {
  return new Promise((resolve) => { // eslint-disable-line
    resolve(dir);
    // try {
    //   request(path).pipe(fs.createWriteStream(dir)
    //     .then((er) => {
    //       if (er) {
    //         throw new Error(er);
    //       }
    //       resolve(dir);
    //     }));
    // } catch (er) {
    //   reject(er);
    // }
  });
}

/**
 * Resive an image thumbnail
 * @param {Object} req the request
 * @param {Object} res the reponse
 */
module.exports.resize = (req, res) => {
  logger = req.logger; // eslint-disable-line
  const token = req.get('authorization'); // eslint-disable-line
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
            .then(() => {
              logger.debug('sending resized thumbnail');
              res.sendFile(downloadPath);
              res.end();
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
