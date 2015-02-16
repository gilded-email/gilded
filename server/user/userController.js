var Promise = require('bluebird');
var userModel = require('./userModel.js');
var domain = process.env.DOMAIN;
var dispatcher = 'jenkins@' + domain;

module.exports = {
  addVip: function (username, emailAddress) {
    return new Promise(function (resolve, reject) {
      userModel.findOneAndUpdate({username: username}, {$push: {vipList: emailAddress}}, function (error, user) {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(user);
        }
      });
    });
  },

  removeVip: function (username, emailAddress) {
    return new Promise(function (resolve, reject) {
      userModel.findOneAndUpdate({username: username}, {$pull: {vipList: emailAddress}}, function (error, user) {
        if (error) {
          console.log(error);
          reject();
        } else {
          resolve(user);
        }
      });
    });
  },

  isVip: function (username, sender) {
    return new Promise(function (resolve, reject) {
      userModel.findOne({username: username}, function (error, user) {
        if (error) {
          reject(error);
        } else if (!user) {
          reject('Looking for a user that does not exist');
        } else {
          if ((sender === dispatcher) || (user.vipList.indexOf(sender) >= 0)) {
            resolve(user.forwardEmail); // TODO: change to forwardAddress
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  getRate: function (username) {
    return new Promise(function (resolve, reject) {
      userModel.findOne({username: username}, function (error, user) {
        if (error) {
          reject(error);
        } else if (!user) {
          reject('Looking for a user that does not exist');
        } else {
          resolve(user.rate);
        }
      });
    });
  }
};
