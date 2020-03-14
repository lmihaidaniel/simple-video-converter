import { log, mergeDeep } from './utils';
import defaultConfig from './config';
import ffMpeg from 'ffmpeg';

const spawnFfmpeg = (input, output, config = {}) => new Promise((resolve, reject) => {
  const transcoder = ffMpeg();
  config = mergeDeep(defaultConfig, config);

  transcoder
    .on('start', () => log.ok(`Starting processing: ${input}`))
    .on('end', () => {
      log.ok(`Finished processing: ${input}`);
      resolve();
    })
    .on('progress', ({ timemark, percent = 0 }) => log.warn(`Progress: ${timemark} ... ${Math.round(percent)}%`))
    .on('error', (err) => {
      log.fail(`Cannot process video: ${err.message}`);
      reject(err);
    })
    ;

  if (Array.isArray(input) && input.length) {
    input.map(item => transcoder.mergeAdd(item));
    transcoder.addOption('-movflags', 'faststart');
    transcoder.mergeToFile(output);
  } else {
    transcoder
      .videoCodec(config.video.codec)
      .format(config.video.format)
      .addOption('-crf', config.video.quality)
      .size(config.video.resolution)
      .addOption('-bufsize', config.video.bufsize)
      .videoBitrate(config.video.maxrate)
      .addOption('-profile:v', config.video.profile)
      .addOption('-level', config.video.level)
      .addOption('-flags', '+cgop')
      .addOption('-pix_fmt', 'yuv420p')
      .audioCodec(config.audio.codec)
      .audioBitrate(config.audio.bitrate)
      .audioFrequency(config.audio.rate)
      .audioChannels(2)
      .audioQuality(5)
      .addOption('-movflags', 'faststart');

    transcoder.input(input);
    transcoder.output(output).run();
  }
});

export const converter = config => (input, output) => spawnFfmpeg(input, output, config);

export const multiConverter = (videoList, config) => {
  const runner = converter(config);

  videoList.reduce(async (previousConversion, { input, output }) => {
    await previousConversion;
    return runner(input, output);
  }, Promise.resolve());
};
