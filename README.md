# node-media-server

## what this is?
A media server that runs on node.

## why?
I wanted to stream media.

## install
```javascript

```
## develop
This server requires [ffmpeg](https://ffmpeg.zeranoe.com/builds/) to generate thumbnails. Install [ffmpeg](https://ffmpeg.zeranoe.com/builds/) and place it in your path.

Once [ffmpeg](https://ffmpeg.zeranoe.com/builds/) is installed, you must run the client and the server.

```bash
npm install
npm run server
```
and in a separate shell
```bash
npm start
```

## Add libraries
Navigate to [the admin panel](http://localhost:3000/admin).
Use the form on the left to create a new library. The path is an absolute path to your media. The name is what will be shown in the dropdown menu.

## attributions
[ [daspinola](https://github.com/daspinola) / [video-stream-sample](https://github.com/daspinola/video-stream-sample) ] - for figuring out how to stream from express.
