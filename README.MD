`version 0.2.0`

## Requirements

You need to have ffmpeg installed on your machine before using this package

## Installation

```bash
npm install simple-video-converter
```

## USAGE

```javascript
var sfw = require('simple-video-converter');
var config = {
  video: {
    codec: "libx264",
    format: "mp4",
    quality: 25,
    resolution: "1280x720",
    bufsize: '923k',
    maxrate: '692k',
    profile: 'main',
    level: 3.1
  },
  audio: {
    codec: "aac",
    bitrate: "128k",
    rate: 48000
  }
}
var videolist = [
  ['/path/videoToConvert.mov','/path/videoConverted.mp4'],
  ...
];
var onEnd = function(){console.log('done')};

sfw.multi(config, videolist, onEnd);

sfw.single(config)('/path/videoToConvert.mov', '/path/videoConverted.mp4', onEnd);
```

## USE IT AS CLI
if installed globally you can use it directly in command line

```bash
$ simple-video-converter
or
$ svc
```