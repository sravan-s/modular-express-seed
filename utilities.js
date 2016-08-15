const utilities = {};

// To Do: Move to config
// Put your utilities at common/utilities
const UTILITIES_BASE_FOLDER = './common/utilities/';

utilities.log = require(UTILITIES_BASE_FOLDER + 'logger');
utilities.crud = require(UTILITIES_BASE_FOLDER + 'crud');
utilities.mongoose = require(UTILITIES_BASE_FOLDER + 'db');
utilities.parseParams = require(UTILITIES_BASE_FOLDER + 'parse-params');

module.exports = utilities;
