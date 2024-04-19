'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      contentScript: PATHS.src + '/contentScript.js',
      background: PATHS.src + '/background.js',
      compose_mail: PATHS.src + '/compose_mail.js',
      annyang_min: PATHS.src + '/annyang_min.js',
      inbox: PATHS.src + '/inbox.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
