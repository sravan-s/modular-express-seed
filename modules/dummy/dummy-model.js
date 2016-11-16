// For load testing purposess
var mongoose = require('../../utilities').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var dummySchema = new mongoose.Schema({
  key: String,
  value: String
});

dummySchema.plugin(mongoosePaginate);

var Dummy = mongoose.model('dummy', dummySchema);

module.exports = {
  model: Dummy,
  schema: dummySchema
};
