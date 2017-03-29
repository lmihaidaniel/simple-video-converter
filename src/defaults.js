module.exports = {
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
  },
  extensions: [".mp4", ".webm", ".mov", ".ogv"]
};
