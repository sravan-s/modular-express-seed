var express = require('express');
var authRoutes = express.Router();
var nonAuthRoutes = express.Router();

var DmsFactory = require('./dms-upload-routes');
DmsFactory(authRoutes);

var ReportsFactory = require('./accounting-reports-routes');
ReportsFactory(authRoutes);

module.exports = {
  authRoutes: authRoutes,
  nonAuthRoutes: nonAuthRoutes
};
