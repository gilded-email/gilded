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
          if (error.err) {
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
          } else {

            // Send welcome email
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
          from: 'hello@gilded.club',
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
        tokenGen(username, expiration)
          .then(function (hash) {
            var urlToken = base64Url.encode(username + '+' + expiration + '+' + hash);
            var resetUrl = 'https://www' + domain + '/resetpassword/' + urlToken;
            res.status(201).send('Password reset sent for ' + username);
            require('../email/emailController.js').sendEmail({
              to: user.forwardEmail,
              from: 'hello@gilded.club',
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

  handleForgotPassword: function (req, res, urlToken) {
    var params = base64Url.decode(urlToken).split('+');
    var username = params[0];
    var expiration = params[1];
    var checkToken = process.env.SECRET + username + expiration;
    var hash = params[2];
    bcrypt.compare(checkToken, hash, function (error, result) {
      if (error) {
        console.log('Compare error: ', error);
        // Compare error
      } else if (!result) {
        console.log('The hash isn\'t valid');
      } else {
        if (req.cookies.userExpiration < Date.now()) {
          console.log('Your Forgot Password request expired. It only lasts 24 hours. Ask for a new one.');
        } else {
          console.log('Good urlToken!');
        }
      }
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
