// Creates a list of available models

var fs = require('fs');
var path = require('path');

// Function to get all directories
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

var directories = getDirectories('modules');

var models = [];

// Iterate through modules directory to create models
directories.forEach(function(directory) {
  var m = require('../modules/' + directory);
  m.$$name = directory;
  models.push(m);
});

// To get model
function _getModel(name) {
  var mdl = {};
  models.some(function(model) {
    if (model.$$name == name) {
      mdl = model.model;
      return true;
    }
  });
  return mdl;
}

// Creates $$externalModelObjs helper for pagination
models.forEach(function(model) {
  if (model.model.$$externals) {
    model.model.$$externals.forEach(function(external) {
      external.modelObj = _getModel(external.model);
    });
  }
});

module.exports = {
  models: models,
  getModel: _getModel
};
