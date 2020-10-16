# youtube-audio-stream

[![Build Status](https://travis-ci.org/iSolutionJA/youtube-audio-stream.svg?branch=master)](https://travis-ci.org/iSolutionJA/youtube-audio-stream)
[![code-style](https://img.shields.io/badge/code_style-airbnb--base-brightgreen.svg)](https://github.com/airbnb/javascript)

## Credit

This packaged was originally created by James Kyburz and the repo can be found here: [https://github.com/JamesKyburz/youtube-audio-stream](https://github.com/JamesKyburz/youtube-audio-stream)

## Improvements

- Module returns a promise instead of a stream. Promise when resolved returns the stream that includes:
  - the stream source(m3u8 url or a [Readable](https://github.com/fent/node-ytdl-core#ytdldownloadfrominfoinfo-options) stream)
  - the info from [ytdl-core](https://github.com/fent/node-ytdl-core). See [here](https://github.com/fent/node-ytdl-core/blob/master/example/info.json) for what it contains
  - the [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) instance
  - a boolean for whether or not it is a livestream
  - an event emitter
- Livestreams are now supported
- An example that accepts an arbitrary videoId.
- Updated Dockerfile that uses Node version 10 and ffmpeg version 4
- Two new options:
  - `bitrate` - the bitrate ffmpeg must use to convert the audio stream to. Defaults to `128`. See [here](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#audiobitratebitrate-set-audio-bitrate) for possible values.
  - `startTime` - the time the video should begin. Does **not** apply to live streams. See [here](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#seekinputtime-set-input-start-time) for possible values.

New options example:

```js
// Encode audio at a 192 bitrate and start the audio 30 seconds in
const streamPromise = youtubeAudioStream(uri, { bitrate: 192, startTime: 30 });
```

## Description

To get the youtube video's download stream, the module uses [ytdl-core](https://github.com/fent/node-ytdl-core).

To convert to audio, the module uses [fluent-ffmpeg](https://github.com/schaermu/node-fluent-ffmpeg).

You will need to have [ffmpeg](https://www.ffmpeg.org/) and the necessary encoding libraries and ffmpeg needs to be in the OS's PATH. If you're on OSX, this can be handled easily using [Homebrew](https://brew.sh/) (`brew install ffmpeg`). Otherwise visit [https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg](https://github.com/adaptlearning/adapt_authoring/wiki/Installing-FFmpeg)

## Installation

Via npm:

```bash
npm install @isolution/youtube-audio-stream
```

## Usage

Here is an example that creates an express server with one route and streams the audio to the response. To hear the audio for a specific video:

1. Get a videoId
2. Go to `http://localhost:3000/:videoId`

```js
const express = require('express');
const youtubeAudioStream = require('@isolution/youtube-audio-stream');
const app = express();
const port = 3000;

app.get('/:videoId', (req, res) => {
  const requestUrl = `http://youtube.com/watch?v=${req.params.videoId}`;
  const streamPromise = youtubeAudioStream(requestUrl);
  streamPromise
    .then(stream => {
      stream.emitter.on('error', err => {
        console.log(err);
      });
      stream.pipe(res);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
```

### Error Handling

There are two places where you need to handle errors. They are:

1. Promise rejected using `.catch`
2. Promise resolved using `stream.emitter` to listen for `error` events

## Testing

### Testing locally

This package comes with a simple example for testing. This can be run with the command `npm run example`, which will start a basic http server that serves two routes, first one sends an html file to `http://localhost:3000/` and the second one streams audio to the response using this package.

Note: After selecting "OK", the play button has to be clicked for audio to start playing because most browsers disable autoplay.

### Testing inside a docker container

You can test this module without the need to have [ffmpeg](https://www.ffmpeg.org/) locally installed by doing it inside a docker container.

To build the docker image:

```docker
docker build --rm -f "Dockerfile" -t youtube-audio-stream:latest .
```

To run the test:

```docker
docker run --rm -d -p 3000:3000/tcp youtube-audio-stream:latest
```
