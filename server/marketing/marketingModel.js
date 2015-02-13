var db = require('../../db/db.js');
var mongoose = require('mongoose');

var MarketingSchema = new mongoose.Schema({
  email: String
});

module.exports = mongoose.model('Marketing', MarketingSchema);
