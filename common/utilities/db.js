var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// To Do: Change URL to config
var url = 'mongodb://localhost:27017/epochDb';
// To Do: Set secret key
mongoose.secretKey = "essess";

mongoose.connect(url, function () {
  console.log('mongodb connected');
});

module.exports = mongoose;
