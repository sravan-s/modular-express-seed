var express = require('express');
var router = express.Router();
var nonAuthRoute = express.Router();

var fs = require('fs');
var path = require('path');

// var CONFIG = require('../config');
var epoch = require('../utilities');
var middlewares = require('./middlewares');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

// Automatically generate API endpoints
var directories = getDirectories('modules');
var modules = {};

directories.forEach(function(directory) {

  var tempRoute;

  modules[directory] = require('../modules/' + directory);

  // The model is a nonAuthRoute if isNotAuth variable is true
  // Else the model requires authentication
  if (modules[directory].isNotAuth) {
    tempRoute = nonAuthRoute;
  } else {
    tempRoute = router;
  }

  // Get all
  tempRoute.get('/api/' + directory + 's/', function(req, res) {
    epoch.crud('get', modules[directory]['model'], req, res);
  });

  // Get one result
  tempRoute.get('/api/' + directory + 's/find/:id', function(req, res) {
    epoch.crud('getOne', modules[directory]['model'], req, res);
  });

  // Pagination
  tempRoute.get('/api/' + directory + 's/paginate/', function(req, res) {
    epoch.crud('paginate', modules[directory]['model'], req, res);
  });

  // Create new
  tempRoute.post('/api/' + directory + 's', function(req, res) {
    epoch.crud('post', modules[directory]['model'], req, res);
  });

  // Updates existing
  tempRoute.put('/api/' + directory + 's/:id', function(req, res) {
    epoch.crud('put', modules[directory]['model'], req, res);
  });

  // Delete a specific entry
  tempRoute.delete('/api/' + directory + 's/:id', function(req, res) {
    epoch.crud('delete', modules[directory]['model'], req, res);
  });
});

epoch.models = modules;

// Auth route
nonAuthRoute.post('/auth', function(req, res) {
  if (req.body.username && req.body.password) {
    var promise = epoch.crud('getData', modules.admin.model, req.body);
    promise.then(function(data) {
      var payload = {
        '_id': data['_id'],
        settings: data.settings
      };
      var token = middlewares.auth.jwtEncode(payload);
      res.json({
        token: token
      });
    })
    .catch(function(error) {
      res.status(401)
        .send({
          message: error[0]
        });
    });
  } else {
    res.status(401)
      .send({
        message: 'Username or Password missing'
      });
  }
});

module.exports = {
  router: router,
  nonAuthRoute: nonAuthRoute
};
