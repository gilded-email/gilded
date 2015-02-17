var Promise = require('bluebird');
var User = require('./userModel.js');
var domain = process.env.DOMAIN;
var dispatcher = 'jenkins@' + domain;
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  join: function (req, res) {
    var userData = {
      username: req.body.username,
      forwardEmail: req.body.forwardEmail
    };

    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.sendStatus(409);
      } else {
        userData.password = hash;
        User.create(userData, function (error, result) {
          if (error) {
            console.log(error);
            res.status(409).send(error);
          } else {
            res.status(201).send(result);
          }
        });
      }
    });
  },

  signIn: function (req, res) {
    User.findOne({username: req.body.username}, function (error, user) {
      if (error) {
        console.log(error);
      } else if (!user) {
        console.log('user does not exist');
        res.sendStatus(404);
      } else {
        bcrypt.compare(req.body.password, user.password, function (error, response) {
          if (error) {
            console.log(error);
          } else if (response === false) {
            res.status(422).send('wrong password');
          } else {
            res.status(201).send(user);
          }
        });
      }
    });
  },

  editVip: function (req, res) {
    User.findOneAndUpdate({_id: req.params.userId}, {$push: {vipList: {$each: req.body.add}}}, function (error, user) {
      if (error) {
        console.log(error);
        res.sendStatus(409);
      } else {
        User.findOneAndUpdate({_id: user._id}, {$pullAll: {vipList: req.body.remove}}, function (error, user) {
          if (error) {
            console.log(error);
            res.sendStatus(409);
          } else {
            res.status(201).send(user);
          }
        });
      }
    });
  },

  isVip: function (username, sender) {
    return new Promise(function (resolve, reject) {
      User.findOne({username: username}, function (error, user) {
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
      User.findOne({username: username}, function (error, user) {
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
