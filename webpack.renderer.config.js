const webpack = require('webpack');
const rules = require('./webpack.rules');
const ffmpegPath = require('ffmpeg-static').path;

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  externals:{
    'sharp': 'commonjs sharp'
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env.FLUENTFFMPEG_COV': false
    })
  ],
  //ffmpegPath:ffmpegPath
};
