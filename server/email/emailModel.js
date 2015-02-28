require('../../db/db.js');
var mongoose = require('mongoose');

var EmailSchema = new mongoose.Schema({
  sentDate: {type: Date, default: Date.now},
  paid: {type: Boolean, default: false},
  email: String,
  recipient: String,
  cost: {type: Number, default: 100},
  attachment: {type: Buffer}
});

module.exports = mongoose.model('Escrow', EmailSchema);
