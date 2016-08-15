// App Initialisation
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Application up and running!');
});

app.listen(3000, () => {
  console.log('App listening on port 3000!', 'info');
});
