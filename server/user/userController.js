var Promise = require('bluebird');
var userModel = require('./userModel.js');

module.exports = {
  isVip: function (username, sender) {
    return new Promise(function (resolve, reject) {
      userModel.findOne({username: username}, function (error, user) {
        if (error) {
          reject(error);
        } else if (!user) {
          reject('Looking for a user that does not exist');
        } else {
          if (user.vipList.indexOf(sender) >= 0) {
            resolve(user.forwardEmail);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
};
