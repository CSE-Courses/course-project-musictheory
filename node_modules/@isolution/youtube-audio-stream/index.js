const ytdl = require('ytdl-core');
const FFmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');
const events = require('events');
const fs = require('fs');

const streamEmitter = new events.EventEmitter();

function streamify(uri, opt) {
  const options = {
    ...opt,
    quality: 'highestaudio',
    audioFormat: 'mp3'
  };

  const streamPromise = ytdl
    .getInfo(uri)
    .then(info => {
      const isLive = info.player_response.videoDetails.isLiveContent;

      const streamSource = { isLive, info: {}, source: '' };

      if (isLive) {
        // source is the m3u8 url
        streamSource.source = ytdl.chooseFormat(info.formats, {
          quality: 'highestaudio'
        }).url;
      } else {
        // source is the Readable stream
        streamSource.source = ytdl.downloadFromInfo(info, options);
      }

      streamSource.isLive = isLive;
      streamSource.info = info;

      return streamSource;
    })
    .then(streamObj => {
      const { isLive } = streamObj;

      const { file, audioFormat, bitrate, startTime } = options;
      const stream = file ? fs.createWriteStream(file) : new PassThrough();
      const audioBitrate = bitrate || 128; // default bitrate is 128 if one was not passed

      const ffmpeg = new FFmpeg(streamObj.source);

      // Disable for undefined and livestreams
      if (startTime && !isLive) {
        ffmpeg.setStartTime(startTime);
      }

      // convert audio and start writing to stream
      ffmpeg
        .audioCodec('libmp3lame')
        .audioBitrate(audioBitrate)
        .format(audioFormat)
        .pipe(stream);

      // Error Emitters
      // If it is NOT a livestream url, it has event listeners
      if (!isLive) {
        streamObj.source.on('error', error => {
          streamEmitter.emit('error', error);
        });
      }

      ffmpeg.on('error', error => {
        if (!isLive) {
          streamObj.source.end();
        }

        // If it is NOT a livestream url, it must be a readable stream
        // which can be stopped when an error occurs
        streamEmitter.emit('error', error);
      });

      // stream.source = streamObj;
      stream.info = streamObj.info;
      stream.ffmpeg = ffmpeg;
      stream.isLive = isLive;
      stream.emitter = streamEmitter;

      return stream;
    })
    .catch(err => {
      throw err;
    });

  return streamPromise;
}

module.exports = streamify;
