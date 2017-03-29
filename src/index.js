var util = require("util"),
  semafor = require("semafor"),
  deepmerge = require("./deepmerge"),
  defaults = require("./defaults"),
  spawn = require("child_process").spawn;

var log = semafor();
// Log and close the process.
function error(msg) {
  log.log("");
  log.fail(msg.toString());
  process.exit(1);
}

var noOp = function() {};

function spawnFfmpeg(exitCallback, args, source, output) {
  var ffmpeg = spawn("ffmpeg", args);
  log.log('\n');
  log.warn("Converting " + source);

  ffmpeg.on("exit", exitCallback);
  ffmpeg.stderr.on("data", function(data) {
      if(data.indexOf('frame=') == 0) log.ok(data);
  });
  return ffmpeg;
}

var converter = function(settings) {
  var config = deepmerge(defaults, settings);
  return function(_in, _out, cb) {
    spawnFfmpeg(
      cb || noOp,
      [
        "-y",
        "-i",
        "" + _in + "",
        "-codec:v",
        "" + config.video.codec + "",
        "-f",
        "" + config.video.format + "",
        "-profile:v",
        "" + config.video.profile + "",
        "-level",
        "" + config.video.level + "",
        "-crf",
        "" + config.video.quality + "",
        "-bf",
        "" + config.video.bufsize + "",
        "-maxrate",
        "" + config.video.maxrate + "",
        "-s",
        "" + config.video.resolution + "",
        "-flags",
        "+cgop",
        "-pix_fmt",
        "yuv420p",
        "-codec:a",
        "" + config.audio.codec + "",
        "-strict",
        "-2",
        "-b:a",
        "" + config.audio.bitrate + "",
        "-r:a",
        "" + config.audio.rate + "",
        "-movflags",
        "faststart",
        "" + _out + ""
      ],
      _in,
      _out
    );
  };
};
var multiConverter = function(settings, videos, cb_end) {
  var runner = function(i) {
    if (i === videos.length) {
      cb_end();
      return;
    }
    converter(settings)(videos[i][0], videos[i][1], function() {
      runner(i + 1);
    });
  };
  if (videos.length > 0) {
    runner(0);
  }
};

module.exports = {
  single: converter,
  multi: multiConverter
};
