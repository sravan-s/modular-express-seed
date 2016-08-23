const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// To Do: Change URL to config
const url = 'mongodb://localhost/epochDb';
// To Do: Set secret key
mongoose.secretKey = 'essess';

mongoose.connect(url, () => {
  console.log('mongodb connected');
});

module.exports = mongoose;
