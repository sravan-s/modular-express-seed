// App Initialisation
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Application up and running!');
});

app.listen(3000, function () {
  console.log('App listening on port 3000!', 'info');
});
