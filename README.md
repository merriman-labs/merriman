# merriman
[![Bless](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/ramen.svg)](http://lunagao.github.io/BlessYourCodeTag/) 
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## What this is?
A media server that runs on node.

## Why?
I wanted to stream media at home.

## Dependencies
- ffmpeg - This server requires [ffmpeg](https://ffmpeg.zeranoe.com/builds/) to generate thumbnails, subtitles, and burn tracks. Install [ffmpeg](https://ffmpeg.zeranoe.com/builds/) and place it in your path.
- MongoDB - This server requires MongoDB to store media and library information. The easiest way to do this is in a Docker container.

## Install.

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
merriman run config.json
```

### Adding media
```bash
merriman initdir config.json c:\users\movies
```

## Sample configuration file
```json
{
  "mediaLocation": "c:\\media\\",                   // where uploaded media gets stored
  "thumbLocation": "c:\\thumbnails\\",              // where generated thumbnails get stored
  "name": "Movies",                                 // The name of the server
  "mongo": {
    "connectionString": "mongodb://127.0.0.1",      // MongoDB connection string
    "database": "Movies"                            // The name of the database to store items in
  },
  "port": 80                                        // The port to bind to. Might require admin/sudo for <3000
}
```

## Developing

Once [ffmpeg](https://ffmpeg.zeranoe.com/builds/) is installed, you must run the client and the server.

```bash
npm install
npm run server:watch # starts the server
```
and in a separate shell
```bash
npm start # starts the UI
```

## Libraries
 - Inversify - Used for dependency injection
 - Ramda - Utility library
 - AJV - Payload validation
 - Nodemon - Enables watch-mode for server
 - Create-react-app/react-scripts - Bootstrapped the UI
 - React - Primary UI library
 - Reactstrap - Bootstrap components for React
 - Bootstrap - Style library

## Attributions
[ [daspinola](https://github.com/daspinola) / [video-stream-sample](https://github.com/daspinola/video-stream-sample) ] - for figuring out how to stream from express.
