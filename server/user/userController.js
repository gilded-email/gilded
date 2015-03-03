var fs = require('fs');
var path = require('path');
var jade = require('jade');
var bcrypt = require('bcrypt-nodejs');
var BPromise = require('bluebird');
var base64Url = require('base64-url');
var emailValidator = require('email-validator');

var stripe = require('stripe')(process.env.STRIPE);
var domain = process.env.DOMAIN;
var dispatcher = 'jenkins@' + domain;

var User = require('./userModel.js');

var makeHash = function (username, expiration) {
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

var checkHash = function (username, expiration, hash) {
  return new BPromise(function (resolve, reject) {
    if (expiration < Date.now()) {
      reject('Expired token');
      return;
    }
    var checkToken = process.env.SECRET + username + expiration;
    bcrypt.compare(checkToken, hash, function (error, result) {
      if (error) {
        console.log('Compare error: ', error);
        reject();
      } else if (!result) {
        reject('Invalid hash');
      } else {
        resolve('Valid hash');
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

    // Check if username and password are not blank
    if (userData.username === '' || req.body.password === '') {
      res.status(409).send({
        error: 'Username and password required'
      });
      return;
    }

    // Check if username is valid
    if (userData.username.indexOf('+') > -1 || !emailValidator.validate(userData.username + '@gilded.club')) {
      res.status(409).send({
        error: 'Username not valid'
      });
      return;
    }

    // Check is forward email is valid
    if (!emailValidator.validate(req.body.forwardEmail)) {
      res.status(409).send({
        error: 'Not a valid email address'
      });
      return;
    }

    // Create user in DB with hashed password
    bcrypt.hash(req.body.password, null, null, function (error, hash) {
      if (error) {
        console.log(error);
        res.status(409).send(error);
      } else {
        userData.password = hash;
        User.create(userData, function (error, user) {
          console.log(error);

          // Send error message to client
          if (error) {
            if (error.err.indexOf('$username') > -1) {
              res.status(409).send({
                error: 'Username already exists'
              });
              return;
            }
            if (error.err.indexOf('$forwardEmail') > -1) {
              res.status(409).send({
                error: 'Forward email already in use'
              });
              return;
            }
            return;
          }

          // Send welcome email
          fs.readFile(path.join(__dirname, '/../../views/welcomeEmail.jade'), 'utf8', function (error, data) {
            if (error) {
              console.log('Welcome Email error: ', error);
            } else {
              var compiledHtml = jade.compile(data);
              var email = user.username + '@' + domain;
              var html = compiledHtml({email: email, domain: domain});
              var newUserEmail = {
                to: user.forwardEmail,
                from: 'welcome@' + domain,
                fromname: 'Welcome to Gilded',
                subject: 'Welcome to Gilded',
                html: html
              };
              req.user = user.toJSON();
              req.welcomeEmail = newUserEmail;
              next();
              require('../email/emailController.js').sendEmail(newUserEmail);
            }
          });
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
        bcrypt.compare(req.body.password, user.password, function (error, result) {
          if (error) {
            console.log(error);
          } else if (result === false) {
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
    res.clearCookie('expiration');
    res.clearCookie('token');
    res.status(201).send('logged out');
  },

  storeSession: function (req, res, next) {
    var expiration = Date.now() + (1000 * 60 * 60 * 24 * 30);
    makeHash(req.body.username.toLowerCase(), expiration)
      .then(function (token) {
        res.cookie('username', req.body.username.toLowerCase());
        res.cookie('expiration', expiration);
        res.cookie('token', token);
        next();
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  checkSession: function (req, res, next) {
    checkHash(req.cookies.username, req.cookies.expiration, req.cookies.token)
      .then(function () {
        next();
      })
      .catch(function (error) {
        console.log(error);
        res.redirect('/login');
      });
  },

  checkPassword: function (req, res, next) {
    if (!req.body.oldPassword) {
      res.status(400).send('Must enter current password');
    }
    User.findOne({username: req.cookies.username}, function (error, user) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        bcrypt.compare(req.body.oldPassword, user.password, function (error, result) {
          if (error) {
            console.log(error);
          } else if (result === false) {
            res.status(422).send('wrong password');
          } else {
            next();
          }
        });
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
    if (!emailValidator.validate(req.body.add[0])) {
      res.status(400).send('Invalid email address');
      return;
    }
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
          from: 'hello@' + domain,
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
      } else {
        var withdrawalAmount = user.balance - 25; //Stripe transfer fee is $0.25
        stripe.transfers.create({
          amount: withdrawalAmount,
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
          from: 'hello@' + domain,
          subject: 'Forgot Username',
          html: '<h1>Forgot Username</h1>A Forgot Username request was made for this email address. Your Gilded username is: <strong>' + user.username + '</strong><br><br>If this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email <a href="mailto:admin@gilded.club">admin@gilded.club</a>.',
          text: 'A Forgot Username request was made for this email address. Your Gilded username is: *' + user.username + '*\n\nIf this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email admin@gilded.club.'
        });
      }
    });
  },

  requestForgotPassword: function (req, res) {
    var username = req.body.username;
    User.findOne({username: username}, function (error, user) {
      if (error || !user) {
        console.log(error);
        res.status(400).send(error);
      } else {
        var expiration = Date.now() + (1000 * 60 * 60 * 24); // 24 hours
        makeHash(username, expiration)
          .then(function (hash) {
            var resetToken = base64Url.encode(username + '+' + expiration + '+' + hash);
            var resetUrl = 'https://' + domain + '/resetpassword/' + resetToken;
            res.status(201).send('Password reset sent for ' + username);
            require('../email/emailController.js').sendEmail({
              to: user.forwardEmail,
              from: 'hello@' + domain,
              subject: 'Forgot Password Request',
              html: '<h1>Forgot Password</h1>A Forgot Password request was made for your Gilded address. Follow this link to reset your password: <a href="' + resetUrl + '">' + resetUrl + '</a><br><br>If this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email <a href="mailto:admin@gilded.club">admin@gilded.club</a>.',
              text: 'A Forgot Password request was made for your Gilded address. Follow this link to reset your password: ' + resetUrl + '\n\nIf this request wasn\'t made by you, it\'s safe to ignore. If you ever have any problems, please email admin@gilded.club.'
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },

  handleForgotPassword: function (req, res) {
    var params = base64Url.decode(req.params.resetToken).split('+');
    var username = params[0];
    var expiration = params[1];
    var hash = params[2];
    checkHash(username, expiration, hash)
      .then(function () {
        res.redirect('/app/#/resetpassword?' + req.params.resetToken);
      })
      .catch(function (error) {
        if (error === 'Expired token') {
          res.redirect('/expired-reset-password-token.html');
        } else {
          res.redirect('/invalid-reset-password-token.html');
        }
      });
  },

  resetPassword: function (req, res, next) {
    var params = base64Url.decode(req.params.resetToken).split('+');
    var username = params[0];
    var expiration = params[1];
    var hash = params[2];
    checkHash(username, expiration, hash)
      .then(function () {
        req.cookies.username = username;
        next();
      })
      .catch(function (error) {
        res.status(400).send(error);
      });
  },

  normalizeInput: function (req, res, next) {
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase();
    }
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    next();
  }
};
