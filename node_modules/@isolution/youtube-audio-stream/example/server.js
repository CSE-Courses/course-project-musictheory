/* eslint-disable no-console */
const http = require('http');
const fs = require('fs');
const youtubeAudioStream = require('..');

const port = 3000;
const server = http.createServer((req, res) => {
  // Send index.html
  if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': data.length
      });
      res.write(data);
      res.end();
    });
  }

  // Stream audio
  const regex = new RegExp('/([a-zA-Z0-9-_]{11}$)');
  if (regex.test(req.url)) {
    const videoId = regex.exec(req.url)[1];
    const requestUrl = `http://youtube.com/watch?v=${videoId}`;
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
  }
});

server.listen(port, () => {
  console.log('Go to http://localhost:3000/');
});
