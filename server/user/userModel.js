var db = require('../../db/db.js');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  forwardEmail: {type: String, unique: true, required: true}, // TODO: rename forwardAddress
  vipList: Array,
  balance: {type: Number, default: 0},
  rate: {type: Number, default: 100}
});

module.exports = mongoose.model('User', UserSchema);
