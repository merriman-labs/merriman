import { exec } from 'child_process';
import { readFileSync } from 'fs';

const ffmpeg = function (
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
    exec(command, { windowsHide: true }, function (err, stdout, stderr) {
      if (err) return reject(err);

      return resolve({ stdout, stderr });
    });
  });
};

export const requestMeta = function (
  file: string
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('All arguments are required!'));
    }
    const command = `ffprobe "${file}"`;
    exec(command, { windowsHide: true }, function (err, stdout, stderr) {
      if (err) return reject(err);

      return resolve({ stdout, stderr });
    });
  });
};

export const generateSubs = function (
  file: string,
  track: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('All arguments are required!'));
    }
    const command = `ffmpeg -i "${file}" -map ${track} "${file}.srt"`;
    exec(command, { windowsHide: true }, function (err, stdout, stderr) {
      if (err) return reject(err);
      const subs = readFileSync(`${file}.srt`, { encoding: 'utf8' });

      return resolve(subs);
    });
  });
};

export default ffmpeg;
