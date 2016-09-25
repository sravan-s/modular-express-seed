Start App: npm start
Before push: npm run lint

Dev. Settings:
app: localhost:5000
mongodb: localhost27000

common/utilities/db.js
mongo connection string: mongodb://user:password@localhost:27017/epochDb

use epochDb;

db.createUser( { user: "user", pwd: "admin", roles: ["readWrite"]})
