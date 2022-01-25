'use strict';
import defaultsDeep from 'lodash.defaultsdeep';
/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

// Initialize with base config
var config = require('./config/base.js');

// Load environment-specific configs
var envConfig = {
  cypress: require('./config/cypress.js'),
  production: require('./config/production.js'),
  staging: require('./config/staging.js'),
  testing: require('./config/testing.js'),
};

if (process.env.NODE_ENV === 'production') {
  config = defaultsDeep(envConfig.production || {}, config);
} else if (process.env.NODE_ENV === 'cypress') {
  config = defaultsDeep(envConfig.cypress || {}, config);
} else if (process.env.NODE_ENV === 'testing') {
  config = defaultsDeep(envConfig.testing || {}, config);
} else if (process.env.NODE_ENV === 'staging') {
  config = defaultsDeep(envConfig.staging, config);
}

// Apply local config
config = defaultsDeep(require('./config/local.js') || {}, config);

// The require doesn't play super well with es6 imports. It creates an internal
// 'default' property. Export that.
export default config.default;
