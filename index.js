var inquirer = require("inquirer"),
  semafor = require("semafor"),
  deepmerge = require("./src/deepmerge"),
  defaults = require("./src/defaults"),
  converter = require("./src/index.js"),
  klaw = require("klaw"),
  fs = require("fs"),
  path = require("path");

var log = semafor();

function runConverter(input, output, settings) {
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  var videos = [];
  klaw(input)
    .on("data", function(item) {
      var ext = path.extname(item.path);
      if (settings.extensions.indexOf(ext) > -1) {
        var out = output + path.sep + path.basename(item.path, ext) + ".mp4";
        videos.push([item.path, path.normalize(out)]);
      }
    })
    .on("end", function() {
      converter.multi(settings, videos, function() {
        log.ok("Done");
        process.exit(1);
      });
    });
}

let validators = {
  bitrate: function(value) {
    if (value.match(/^((?!(0))\d.*)+k+$/)) return true;
    return "Please enter a valid bitrate number, eg: 192k";
  },
  resolution: function(value) {
    if (value.match(/^((?!(0))\d.*)+x+((?!(0))[0-9]\d*)$/)) return true;
    return "Please enter a valid resolution, eg: 1280x720";
  },
  number: function(value) {
    return !isNaN(parseFloat(value)) || "Please enter a number";
  }
};

var settings = {
  source: process.cwd(),
  output: process.cwd() + path.sep + "output",
  quality: 23,
  resolution: "1280x720",
  bitrate: "1024k"
};

log.log('simple video converter');
// Start the cli.
inquirer
  .prompt([
    {
      type: "input",
      name: "source",
      message: "Select media files source directory:",
      default: settings.source,
      filter: function(val) {
        return path.normalize(val);
      }
    },
    {
      type: "input",
      name: "output",
      message: "Select output directory:",
      default: settings.output,
      filter: function(val) {
        return path.normalize(val);
      }
    },
    {
      type: "confirm",
      name: "defaults",
      message: "Use default encoding options ?",
      default: true
    },
    {
      type: "input",
      name: "resolution",
      message: "Video resolution:",
      default: settings.resolution,
      when: function(answers) {
        return !answers.defaults;
      },
      validate: validators.resolution
    },
    {
      type: "input",
      name: "quality",
      message: "Video constant quality [Range 18-31, lowest for better quality]:",
      default: settings.quality,
      when: function(answers) {
        return !answers.defaults;
      },
      filter: Number,
      validate: validators.number
    },
    {
      type: "input",
      name: "bitrate",
      message: "Video max bitrate desired:",
      default: settings.bitrate,
      when: function(answers) {
        return !answers.defaults;
      },
      validate: validators.bitrate
    }
  ])
  .then(function(answers) {
    // Get the options and defaults.
    var options = deepmerge(settings, answers);

    
    
    var maxrate = Math.ceil(
      8 * parseFloat(options.bitrate) / 10 - 128
    );
    var bufsize = Math.ceil(4 * maxrate / 3);

    defaults.video.resolution = options.resolution;
    defaults.video.quality = options.quality;
    defaults.video.maxrate = maxrate+"k";
    defaults.video.bufsize = bufsize+"k";

    runConverter(options.source, options.output, defaults);
  });
