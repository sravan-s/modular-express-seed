// App Initialisation
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');

var epochUtilities = require('./utilities');
var models = require('./common/model-factory');
var middleWares = require('./common/middlewares');

var routes = require('./common/routes-factory');
var customRoutes = require('./custom-routes');
// var middleWares = require('./common/middlewares');
routes.makeRoutes(models);

app.get('/', function (req, res) {
  res.send('Application up and running!');
});

// Parses request bodies, in a middleware before your handlers,
// available under the req.body property.
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(routes.nonAuthRoute);

app.use('/resources', express.static('uploads/images'));
app.use('/downloads', express.static('uploads/dms'));

// Auth middleware
app.use(middleWares.auth.getInTheWay);

app.use(customRoutes.authRoutes);
app.use(routes.router);

app.listen(4000, function () {
  epochUtilities.log('App listening on port 4000!', 'info');
});
