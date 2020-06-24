const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  firstName: String,
  email: String,
  password: String,
});
  
var userModel = mongoose.model('users', userSchema);

module.exports = userModel;