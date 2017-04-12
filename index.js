var inquirer = require("inquirer"),
  semafor = require("semafor"),
  deepmerge = require("./src/deepmerge"),
  defaults = require("./src/defaults"),
  converter = require("./src/index.js"),
  fs = require("fs-promise"),
  path = require("path");

var log = semafor();

var args = process.argv.slice(2);
var type = args[0];

function runConverter(videos, output, settings) {
  return fs.ensureDir(output).then(function() {
    converter.multi(settings, videos, function() {
      log.ok("Done");
      process.exit(1);
    });
  });
}

var validators = {
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

inquirer.registerPrompt("directory", require("inquirer-directory"));

var chooseSourceFolder = function() {
  if (type == "--concat") {
    log.warn(
      "Make sure that the videos selected have the same resolution before merging them"
    );
  }
  inquirer
    .prompt([
      {
        type: "directory",
        name: "from",
        message: "Select media files folder source?",
        basePath: settings.source
      }
    ])
    .then(function(answers) {
      var dir = (answers.from || settings.source) + path.sep;
      var files = fs.readdirSync(dir);
      var filelist = [];

      files.forEach(function(file) {
        var filePath = dir + file;
        var ext = path.extname(file);
        if (fs.statSync(filePath).isFile()) {
          if (defaults.extensions.indexOf(ext) > -1) filelist.push(filePath);
        }
      });
      if (filelist.length > 0) {
        chooseSourceFiles(filelist);
      } else {
        log.fail("No supported media files found");
        chooseSourceFolder();
      }
    });
};

var chooseSourceFiles = function(files) {
  inquirer
    .prompt({
      type: "checkbox",
      name: "files",
      message: "Select the files to convert",
      choices: files,
      validate: function(answer) {
        if (answer.length < 1) {
          return "You must choose at least one media file.";
        }
        return true;
      }
    })
    .then(function(answers) {
      chooseSettings(answers.files);
    });
};

var chooseSettings = function(files) {
  inquirer
    .prompt([
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

      var maxrate = Math.ceil(8 * parseFloat(options.bitrate) / 10 - 128);
      var bufsize = Math.ceil(4 * maxrate / 3);

      defaults.video.resolution = options.resolution;
      defaults.video.quality = options.quality;
      defaults.video.maxrate = maxrate + "k";
      defaults.video.bufsize = bufsize + "k";

      var videos = [];
      if (type !== "--concat") {
        files.forEach(function(item) {
          var ext = path.extname(item);
          var out = answers.output +
            path.sep +
            path.basename(item, ext) +
            ".mp4";
          videos.push([item, path.normalize(out)]);
        });
      } else {
        videos = [[[], answers.output + path.sep + "concat.mp4"]];
        files.forEach(function(item) {
          videos[0][0].push(item);
        });
      }
      runConverter(videos, answers.output, defaults);
    });
};

chooseSourceFolder();
