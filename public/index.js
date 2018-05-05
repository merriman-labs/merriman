document.addEventListener('DOMContentLoaded', init, false);

const partition = d => arr =>
  arr.reduce(
    (memo, val) => {
      if (memo[memo.length - 1].length < 3) memo[memo.length - 1].push(val);
      else memo.push([val]);
      return memo;
    },
    [[]]
  );
const tap = f => x => {
  f(x);
  return x;
};

/** @returns {Promise<string>} */
const addVideos = () => {
  const videoList = document.getElementById('video-list');

  return fetch('/video-list')
    .then(res => res.json())
    .then(res => res.files)
    .then(files => {
      const anchors = files.map(file => {
        const card = document.createElement('div');
        const a = document.createElement('a');
        const img = document.createElement('img');
        const body = document.createElement('div');

        card.setAttribute('class', 'card');
        body.setAttribute('class', 'card-footer');

        img.setAttribute('src', `/static/${file}.png`);
        img.setAttribute('class', 'card-image-top');

        a.textContent = file;
        a.setAttribute('href', `/#${file}`);
        a.setAttribute('class', 'btn btn-primary btn-block');

        body.appendChild(a);
        card.appendChild(img);
        card.appendChild(body);

        return card;
      });

      const groups = partition(3)(anchors);
      const row = document.createElement('div');
      row.setAttribute('class', 'row');

      groups.forEach(partition => {
        partition.forEach(element => {
          const col = document.createElement('div');
          col.setAttribute('class', 'col-sm-6 col-lg-3');
          col.appendChild(element);
          row.appendChild(col);
        });
      });

      videoList.appendChild(row);
      return files;
    });
};
const setVideoSource = () => {
  const player = document.getElementById('video-player');
  const hash = window.location.hash.substr(1);
  if (hash.length) {
    player.setAttribute('src', `/v/${hash}`);
    window.scrollTo({ top: 0 });
  }
};
/**
 * You can manipulate the video here
 * For example: Uncomment the code below and in the index to get a Start/Stop button
 */
function init() {
  // const VP = document.getElementById('videoPlayer')
  // const VPToggle = document.getElementById('toggleButton')
  // VPToggle.addEventListener('click', function() {
  //   if (VP.paused) VP.play()
  //   else VP.pause()
  // })
  addVideos().then(tap(setVideoSource));
  window.onhashchange = setVideoSource;
}
