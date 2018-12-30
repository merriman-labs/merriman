# merriman
[![Bless](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/ramen.svg)](http://lunagao.github.io/BlessYourCodeTag/) 
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## What this is?
A media server that runs on node.

## Why?
I wanted to stream media.

## Install
This server requires [ffmpeg](https://ffmpeg.zeranoe.com/builds/) to generate thumbnails. Install [ffmpeg](https://ffmpeg.zeranoe.com/builds/) and place it in your path.

This server can be installed by running
```javascript
npm install -g merriman
```

## Usage

### Configuring server
```bash
merriman editconfig
```

### Running the server
```bash
merriman run
```

### Adding media
```bash
merriman initdir
```

## Configuration options

### `mediaLocation` 
_Full path of location where uploaded media is stored_

### `thumbLocation` 
_Full path of location to store thumbnails_

## Developing

Once [ffmpeg](https://ffmpeg.zeranoe.com/builds/) is installed, you must run the client and the server.

```bash
npm install
npm run server-watch
```
and in a separate shell
```bash
npm start
```

## Attributions
[ [daspinola](https://github.com/daspinola) / [video-stream-sample](https://github.com/daspinola/video-stream-sample) ] - for figuring out how to stream from express.
