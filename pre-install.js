var models = require('./common/model-factory');

console.log(models);
models.models.some(function(model) {
  if (model.$$name == 'admin') {
    var m = new model.model({
      username: 'testAdmin',
      password: 'password',
      settings: {}
    });
    m.save();
    return true;
  }
})
