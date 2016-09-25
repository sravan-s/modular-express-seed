var mongoose = require('../../utilities').mongoose;
var mongoosePaginate = require('mongoose-paginate');

// To do: encrypt password
var adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: Object,
  settings: {
    type: Object,
    required: true
  }
});

// Donot change order
adminSchema.plugin(mongoosePaginate);

var admin = mongoose.model('Admin', adminSchema);

module.exports = {
  model: admin,
  schema: adminSchema,
  isNotAuth: true
};