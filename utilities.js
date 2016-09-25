var epoch = {};

// To Do: Move to config
// Put your utilities at common/utilities
var UTILITIES_BASE_FOLDER = './common/utilities/';

epoch.log = require(UTILITIES_BASE_FOLDER + 'logger');
epoch.parseError = require(UTILITIES_BASE_FOLDER + 'parse-error');
epoch.mongoose = require(UTILITIES_BASE_FOLDER + 'db');
epoch.crud = require(UTILITIES_BASE_FOLDER + 'crud');

module.exports = epoch;
