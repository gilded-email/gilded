require('../../db/db.js');
var mongoose = require('mongoose');
var privates = require('mongoose-private');

var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  password: {type: String, required: true, private: true},
  forwardEmail: {type: String, unique: true, required: true}, // TODO: rename forwardAddress
  vipList: {type: Array, default: []},
  balance: {type: Number, default: 0},
  rate: {type: Number, default: 100},
  stripeId: {type: String, private: true},
  last4: {type: String}
});

UserSchema.plugin(privates, {});
module.exports = mongoose.model('User', UserSchema);
