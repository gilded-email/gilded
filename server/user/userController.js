var fs = require('fs');
var path = require('path');
var jade = require('jade');
var domain = process.env.DOMAIN;
var BPromise = require('bluebird');
var User = require('./userModel.js');
var dispatcher = 'jenkins@' + domain;
var bcrypt = require('bcrypt-nodejs');
var stripe = require('stripe')(process.env.STRIPE);

var tokenGen = function (username, expiration) {
  return new BPromise(function (resolve, reject) {
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
      username: req.body.username.toLowerCase(),
      forwardEmail: req.body.forwardEmail
    };
    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.status(409).send(error);
      } else {
        userData.password = hash;
        User.create(userData, function (error, user) {
          if (error) {
            console.log(error);
            res.status(409).send(error);
          } else {
            //Welcome email
            fs.readFile(path.join(__dirname, '/../../views/welcomeEmail.jade'), 'utf8', function (error, data) {
              if (error) {
                console.log('Welcome Email error: ', error);
              } else {
                var compiledHtml = jade.compile(data);
                var email = user.username + '@' + domain;
                var html = compiledHtml({email: email});
                var newUserEmail = {
                  to: user.forwardEmail,
                  from: 'welcome@gilded.club',
                  subject: 'Welcome to Gilded',
                  html: html
                };
                require('../email/emailController.js').sendEmail(newUserEmail);
              }
            });
            req.user = user.toJSON();
            next();
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
            req.user = user.toJSON();
            next();
          }
        });
      }
    });
  },

  getUser: function (req, res, next) {
    User.findOne({username: req.cookies.username}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        req.user = user.toJSON();
        next();
      }
    });
  },

  sendConfirmation: function (req, res) {
    res.status(201).send(req.user.toJSON());
  },

  logout: function (req, res) {
    res.clearCookie('userExpires');
    res.clearCookie('userToken');
    res.status(201).send('logged out');
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
    var checkToken = process.env.SECRET + req.cookies.username + req.cookies.userExpires;
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

  changePassword: function (req, res, next) {
    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        req.update = {password: hash};
        next();
      }
    });
  },

  updateForwardEmail: function (req, res, next) {
    req.update = {forwardEmail: req.body.forwardEmail};
    next();
  },

  changeRate: function (req, res, next) {
    req.update = {rate: req.body.rate};
    next();
  },

  addVip: function (req, res, next) {
    req.update = {$push: {vipList: {$each: req.body.add}}};
    next();
  },

  removeVip: function (req, res, next) {
    req.update = {$pullAll: {vipList: req.body.remove}};
    next();
  },

  isVip: function (username, sender) {
    return new BPromise(function (resolve, reject) {
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
    return new BPromise(function (resolve, reject) {
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

  addCard: function (req, res, next) {
    var last4 = req.body.card.cardNumber.slice(-4);
    var card = {
      number: req.body.card.cardNumber,
      exp_month: req.body.card.expMonth,
      exp_year: req.body.card.expYear,
      cvc: req.body.card.cvc,
      name: req.body.card.cardHolderName
    };

    User.findOne({username: req.cookies.username}, function (error, user) {
      if (error) {
        console.log('User not found: ', error);
        res.status(400).send(error);
      } else {
        var newCardEmail = {
          to: user.forwardEmail,
          from: 'hello@gilded.club',
          subject: 'New Card Added',
          html: '<h1>New Card Added</h1>A card was recently added to your gilded.club account for receiving payments. If you believe this to be error, please email <a href="mailto:admin@gilded.club">admin@gilded.club</a> immediately.',
          text: 'A card was recently added to your gilded.club account for receiving payments. If you believe this to be an error, please email admin@gilded.club immediately.'
        };

        if (user.stripeId) {
          stripe.recipients.update(user.stripeId, {card: card}, function (error) {
            if (error) {
              console.log('Error updating card: ', error);
              res.status(400).send(error);
            } else {
              require('../email/emailController.js').sendEmail(newCardEmail);
              req.update = {last4: last4};
              next();
            }
          });
        } else {
          stripe.recipients.create({
            name: req.body.card.cardHolderName,
            email: user.forwardEmail,
            type: 'individual',
            description: 'New gilded.club user'
          }, function (error, recipient) {
            if (error) {
              console.log('Error creating recipient: ', error);
              res.status(400).send(error);
            } else {
              stripe.recipients.createCard(recipient.id, {card: card}, function (error) {
                if (error) {
                  console.log('Error adding card: ', error);
                  res.status(400).send(error);
                } else {
                  require('../email/emailController.js').sendEmail(newCardEmail);
                  req.update = {last4: last4, stripeId: recipient.id};
                  next();
                }
              });
            }
          });
        }
      }
    });
  },

  withdraw: function (req, res, next) {
    User.findOne({username: req.cookies.username}, function (error, user) {
      if (error) {
        console.log('User does not exist: ', error);
        res.status(400).send(error);
      }
      if (user.balance === 0) {
        res.status(200).send(user);
      }
      else {
        stripe.transfers.create({
          amount: user.balance,
          currency: 'usd',
          recipient: user.stripeId,
          description: 'Gilded.club balance'
        }, function (error) {
          if (error) {
            console.log(error);
            res.status(400).send(error);
          } else {
            req.update = {balance: 0};
            next();
          }
        });
      }
    });
  },

  update: function (req, res) {
    var update = req.update;
    User.findOneAndUpdate({username: req.cookies.username}, update, function (error, updatedUser) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        res.status(201).send(updatedUser.toJSON());
      }
    });
  },

  forgotUsername: function (req, res) {
    User.findOne({forwardEmail: req.body.email}, function (error, user) {
      if (error || !user) {
        console.log('forgotUsername error: ', error);
        res.status(400).send(error);
      } else {
        res.status(201).send('Reminder sent to ' + req.body.email);
        require('../email/emailController.js').sendEmail({
          to: user.forwardEmail,
          from: 'hello@gilded.club',
          subject: 'Forgot Username',
          html: '<h1>Forgot Username</h1>A Forgot Username request was made for this email address. Your Gilded username is: <strong>' + user.username + '</strong><br><br>If this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email <a href="mailto:admin@gilded.club">admin@gilded.club</a>.',
          text: 'A Forgot Username request was made for this email address. Your Gilded username is: *' + user.username + '*\n\nIf this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email admin@gilded.club.'
        });
      }
    });
  }
};
