var db = require('../../db/db.js');
var mongoose = require('mongoose');

var MarketingSchema = new mongoose.Schema({
  email: String,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Marketing', MarketingSchema);
