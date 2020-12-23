# merriman

[![Bless](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/ramen.svg)](http://lunagao.github.io/BlessYourCodeTag/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/merriman)](https://www.npmjs.com/package/merriman)

_A media server that runs on node._

## Getting started

### Install dependencies

- ffmpeg - This server requires [ffmpeg](https://ffmpeg.zeranoe.com/builds/) to
  generate thumbnails, subtitles, and burn tracks. Install
  [ffmpeg](https://ffmpeg.zeranoe.com/builds/) and place it in your path.
- MongoDB - This server requires MongoDB to store media and library information.
  The easiest way to do this is in a Docker container.

### Install and run the server

```bash
npm install -g merriman
merriman init movies # create a config file called movies.config.json. tweak as necessary
merriman run movies.config.json
```

## Usage

### Running the server

```bash
merriman run config.json
```

## Developing

1. Start an instance of MongoDB.
1. Install ffmpeg
1. Create a directory to house uploaded media
1. Create a directory to house uploaded thumbnails
1. Configure the connection string, media, and thumbnail paths in
   [the development config](./server-config.dev.json)
1. run `npm install`
1. run `npm run server:watch` to start the server
1. run `npm start` to start the UI
