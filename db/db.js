var mongoose = require('mongoose');
var connectionString = process.env.MONGODB;
mongoose.connect(connectionString); // connect to mongo database named shortly

var db = mongoose.connect;
module.exports = db;
