var db = require('../../db/db.js');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  forwardEmail: {type: String, unique: true, required: true},
  vipList: Array
});

module.exports = mongoose.model('User', UserSchema);
