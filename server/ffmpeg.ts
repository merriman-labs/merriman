import { exec } from 'child_process';

const ffmpeg = function(
  file: string,
  destPath: string,
  time: string,
  size: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    if (!(file || destPath || time || size)) {
      return reject(new Error('All arguments are required!'));
    }
    const command = `ffmpeg -ss ${time} -i "${file}" -y -s ${size} -vframes 1 -f image2 "${destPath}"`;
    exec(command, { windowsHide: true }, function(err, stdout, stderr) {
      if (err) return reject(err);

      return resolve({ stdout, stderr });
    });
  });
};

export default ffmpeg;
