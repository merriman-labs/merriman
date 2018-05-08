const { exec } = require('child_process');
const path = require('path');
/**
 *
 * @param {string} path
 * @param {string} destPath
 * @param {string} time
 * @param {string} size
 * @returns {Promise<{stdout:string,stderr:string}>}
 */
const ffmpeg = function(file, destPath, time, size) {
  return new Promise((resolve, reject) => {
    if (!(file || destPath || time || size)) {
      return reject(new Error('All arguments are required!'));
    }
    const command = `ffmpeg -ss ${time} -i "${file}" -y -s ${size} -vframes 1 -f image2 "${destPath}"`;
    exec(command, function(err, stdout, stderr) {
      if (err) return reject(err);

      return resolve({ stdout, stderr });
    });
  });
};

module.exports = ffmpeg;
