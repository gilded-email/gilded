var domain = process.env.DOMAIN;
var Promise = require('bluebird');
var User = require('./userModel.js');
var dispatcher = 'jenkins@' + domain;
var bcrypt = require('bcrypt-nodejs');

var tokenGen = function (username, expiration) {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(process.env.SECRET + username + expiration, null, null, function (error, hash) {
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });
};

module.exports = {
  join: function (req, res, next) {
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
        User.create(userData, function (error, user) {
          if (error) {
            console.log(error);
            res.status(409).send(error);
          } else {
            req.user = user;
            next();
          }
        });
      }
    });
  },

  login: function (req, res, next) {
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
            req.user = user;
            next();
          }
        });
      }
    });
  },

  startProfile: function (req, res) {
    res.status(201).send(req.user);
  },

  logout: function (req, res) {
    res.clearCookie('username');
    res.clearCookie('userExpires');
    res.clearCookie('userToken');
    res.redirect('/');
  },

  storeSession: function (req, res, next) {
    var expiration = Date.now() + (100 * 60 * 62 * 24 * 30);
    tokenGen(req.body.username, expiration)
      .then(function (token) {
        res.cookie('username', req.body.username);
        res.cookie('userExpires', expiration);
        res.cookie('userToken', token);
        next();
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  checkSession: function (req, res, next) {
    bcrypt.compare(process.env.SECRET + req.cookies.username + req.cookies.userExpires, req.cookies.userToken, function (error, result) {
      if (error) {
        console.log("compare err", error);
        res.redirect('/login');
      } else if (result) {
        if (req.cookies.userExpiration < Date.now()) {
          res.redirect('/login');
        } else {
          next();
        }
      } else {
        res.redirect('/login');
      }
    });
  },

  changePassword: function (req, res) {
    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        User.findOneAndUpdate({username: req.cookies.username}, {password: hash}, function (error, user) {
          if (error) {
            console.log(error);
            res.status(400).send(error);
          } else {
            res.status(201).send(user);
          }
        });
      }
    });
  },

  updateForwardEmail: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username}, {forwardEmail: req.body.forwardEmail}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(201).send(user);
      }
    });
  },

  changeRate: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username}, {rate: req.body.rate}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(201).send(user);
      }
    });
  },

  addVip: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username}, {$push: {vipList: {$each: req.body.add}}}, function (error, user) {
      if (error) {
        console.log(error);
        res.sendStatus(409);
      } else {
        res.status(201).send(user);
      }
    });
  },

  removeVip: function (req, res) {
    User.findOneAndUpdate({_id: user._id}, {$pullAll: {vipList: req.body.remove}}, function (error, user) {
      if (error) {
        console.log(error);
        res.sendStatus(409);
      } else {
        res.status(201).send(user);
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
            resolve(user.forwardEmail);
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
