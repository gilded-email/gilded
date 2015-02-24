var domain = process.env.DOMAIN;
var Promise = require('bluebird');
var User = require('./userModel.js');
var dispatcher = 'jenkins@' + domain;
var bcrypt = require('bcrypt-nodejs');
var stripe = require('stripe')(process.env.STRIPE);
var emailController = require('../email/emailController.js');

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
    stripe.customers.create({
      description: 'New gilded.club user',
      email: req.body.forwardEmail
    }, function (error, customer) {
      if (error) {
        console.log(error);
      } else {
        var userData = {
          username: req.body.username.toLowerCase(),
          forwardEmail: req.body.forwardEmail,
          stripeId: customer.id
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
      }
    });
  },

  login: function (req, res, next) {
    User.findOne({username: req.body.username.toLowerCase()}, function (error, user) {
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

  getUser: function (req, res, next) {
    User.findOne({username: req.cookies.username.toLowerCase()}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        req.user = user;
        next();
      }
    });
  },

  sendConfirmation: function (req, res) {
    res.status(201).send(req.user);
  },

  logout: function (req, res) {
    res.clearCookie('username');
    res.clearCookie('userExpires');
    res.clearCookie('userToken');
    res.redirect('/');
  },

  storeSession: function (req, res, next) {
    var expiration = Date.now() + (1000 * 60 * 60 * 24 * 30);
    tokenGen(req.body.username.toLowerCase(), expiration)
      .then(function (token) {
        res.cookie('username', req.body.username.toLowerCase());
        res.cookie('userExpires', expiration);
        res.cookie('userToken', token);
        next();
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  checkSession: function (req, res, next) {
    var checkToken = process.env.SECRET + req.cookies.username.toLowerCase() + req.cookies.userExpires;
    bcrypt.compare(checkToken, req.cookies.userToken, function (error, result) {
      if (error) {
        console.log('Compare error: ', error);
        res.redirect('/login');
      } else if (!result) {
        res.redirect('/login');
      } else {
        if (req.cookies.userExpiration < Date.now()) {
          res.redirect('/login');
        } else {
          next();
        }
      }
    });
  },

  changePassword: function (req, res) {
    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {password: hash}, function (error, user) {
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
    User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {forwardEmail: req.body.forwardEmail}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(201).send(user);
      }
    });
  },

  changeRate: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {rate: req.body.rate}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(201).send(user);
      }
    });
  },

  addVip: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {$push: {vipList: {$each: req.body.add}}}, function (error, user) {
      if (error) {
        console.log(error);
        res.sendStatus(409);
      } else {
        res.status(201).send(user);
      }
    });
  },

  removeVip: function (req, res) {
    User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {$pullAll: {vipList: req.body.remove}}, function (error, user) {
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
  },

  addCard: function (req, res) {
    var last4 = req.body.card.cardNumber.length === 15 ? req.body.card.cardNumber.slice(11) : req.body.card.cardNumber.slice(12);
    User.findOneAndUpdate({username: req.cookies.username.toLowerCase()}, {last4: last4}, function (error, user) {
      if (error) {
        console.log(error);
      } else {
        stripe.customers.createCard(user.stripeId, {
          card: {
            number: req.body.card.cardNumber,
            exp_month: req.body.card.expMonth,
            exp_year: req.body.card.expYear,
            cvc: req.body.card.cvc,
            name: req.body.card.cardHolderName
          }
        }, function (error, card) {
          if (error) {
            console.log(error);
            res.status(400).send(error);
          } else {
            emailController.sendEmail({
              to: user.forwardEmail,
              from: 'hello@gilded.club',
              subject: 'New Card Added',
              html: '<h1>New Card Added</h1>A card was recently added to your gilded.club account for receiving payments. If you believe this to be error, please email <a href="mailto:admin@gilded.club">admin@gilded.club</a> immediately.',
              text: 'A card was recently added to your gilded.club account for receiving payments. If you believe this to be an error, please email admin@gilded.club immediately.'
            });
            res.status(201).send(user);
          }
        });
      }
    });
  },

  cashOut: function (req, res) {
    User.findOne({username: req.cookies.username.toLowerCase()}, function (error, user) {
      if (user.balance === 0) {
        res.status(200).send(user);
      }
      stripe.transfers.create({
        amount: user.balance,
        currency: 'usd',
        recipient: user.stripeId,
        description: 'Gilded.club balance'
      }, function (error, transfer) {
        if (error) {
          console.log(error);
          res.status(400).send(error);
        } else {
          User.findOneAndUpdate({_id: user.id}, {balance: 0}, function (error, updatedUser) {
            if (error) {
              console.log(error);
              res.status(400).send(error);
            } else {
              res.send(201).send(updatedUser);
            }
          });
        }
      });
    });
  }
};
