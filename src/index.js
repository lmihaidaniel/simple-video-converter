var util = require("util"),
  semafor = require("semafor"),
  deepmerge = require("./deepmerge"),
  defaults = require("./defaults"),
  ffmpeg = require("fluent-ffmpeg");

var log = semafor();

// Log and close the process.
function error(msg) {
  log.log("");
  log.fail(msg.toString());
  process.exit(1);
}

function spawnFfmpeg(source, config, output, onEnd) {
  var timemark = null;
  var transcoder = ffmpeg();
  
  transcoder
    .videoCodec(config.video.codec)
    .format(config.video.format)
    .addOption("-crf", config.video.quality)
    .size(config.video.resolution)
    .addOption('-bufsize', config.video.bufsize)
    .videoBitrate(config.video.maxrate)
    .addOption("-profile:v", config.video.profile)
    .addOption("-level", config.video.level)
    .addOption("-flags", "+cgop")
    .addOption("-pix_fmt", "yuv420p")
    .audioCodec(config.audio.codec)
    .audioBitrate(config.audio.bitrate)
    .audioFrequency(config.audio.rate)
    .audioChannels(2)
    .audioQuality(5)
    .addOption("-movflags", "faststart")

  transcoder
    .on("start", function(){
      log.ok("Starting processing: " + source)
    })
    .on("end", function() {
      log.ok("Finished processing: " + source);
      onEnd();
    })
    .on("progress", function(info) {
      log.warn("Progress: " + info.timemark + "... " + Math.round(info.percent||0) + "%");
    })
    .on("error", function(err) {
      log.fail("Cannot process video: " + err.message);
    });

  if (typeof source == "object") {
    source.map(function(item) {
      transcoder.mergeAdd(item)
    });
    transcoder.mergeToFile(output);
  } else {
    transcoder.input(source);
    transcoder.output(output).run();
  }
}

var converter = function(settings) {
  var config = deepmerge(defaults, settings);
  return function(_in, _out, cb) {
    spawnFfmpeg(_in, config, _out, cb);
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
