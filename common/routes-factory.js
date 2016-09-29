var express = require('express');
var router = express.Router();
var nonAuthRoute = express.Router();


// var CONFIG = require('../config');
var middlewares = require('./middlewares');
var epoch = require('../utilities');
var mdls;

function createApiEndPoint(models) {
  // To copy to Auth route
  mdls = models;

  mdls.models.forEach(function(model) {

    var tempRoute;

    // The model is a nonAuthRoute if isNotAuth variable is true
    // Else the model requires authentication
    if (model.isNotAuth) {
      tempRoute = nonAuthRoute;
    } else {
      tempRoute = router;
    }

    // Get all
    tempRoute.get('/api/' + model.$$name + 's/', function(req, res) {
      epoch.crud('get', model.model, req, res);
    });

    // Get one result
    tempRoute.get('/api/' + model.$$name + 's/find/:id', function(req, res) {
      epoch.crud('getOne', model.model, req, res);
    });

    // Pagination
    tempRoute.get('/api/' + model.$$name + 's/paginate/', function(req, res) {
      epoch.crud('paginate', model.model, req, res);
    });

    // Create new
    tempRoute.post('/api/' + model.$$name + 's', function(req, res) {
      epoch.crud('post', model.model, req, res);
    });

    // Updates existing
    tempRoute.put('/api/' + model.$$name + 's/:id', function(req, res) {
      epoch.crud('put', model.model, req, res);
    });

    // Delete a specific entry
    tempRoute.delete('/api/' + model.$$name + 's/:id', function(req, res) {
      epoch.crud('delete', model.model, req, res);
    });
  });
}


// Auth route
nonAuthRoute.post('/auth', function(req, res) {
  var admin = mdls.getModel('admin');
  if (req.body.username && req.body.password) {
    var promise = epoch.crud('getData', admin, req.body);
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
  makeRoutes: createApiEndPoint,
  router: router,
  nonAuthRoute: nonAuthRoute
};
