const express = require('express');
const router = express.Router();

const fs = require('fs')
const path = require('path');

const utilities = require('../utilities');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter((file) => {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Automatically generate API endpoints
const directories = getDirectories('modules');
const modules = {};

// Generates simple API end points with get/post/put/delete
directories.forEach((directory, index) => {
  modules[directory] = require('../modules/' + directory);
  // Breaks the loop if custom setup is to be defined
  if (modules[directory].isCustom) {
    return false;
  }

  router.get('/api/' + directory + 's', (req, res, next) => {
    utilities.crud('get', modules[directory]['model'], req, res);
  });
  router.post('/api/' + directory + 's', (req, res, next) => {
    utilities.crud('post', modules[directory]['model'], req, res);
  });
  router.put('/api/' + directory + 's/:id', (req, res, next) => {
    utilities.crud('put', modules[directory]['model'], req, res);
  });
  router.delete('/api/' + directory + 's/:id', (req, res, next) => {
    utilities.crud('delete', modules[directory]['model'], req, res);
  });
});

module.exports = router;
