var mongoose = require('mongoose');
var connectionString = process.env.MONGODB;
mongoose.connect(connectionString);

var db = mongoose.connect;
module.exports = db;
