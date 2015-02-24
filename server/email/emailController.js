var Promise = require('bluebird');
var formidable = require('formidable');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var userController = require('../user/userController.js');
var Escrow = require('./emailModel.js');
var User = require('../user/userModel.js');
var domain = process.env.DOMAIN;
var payoutRatio = 0.7;

var printAsyncResult = function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
};

var requestPayment = function (savedEmail) {
  var emailRateAndStripe = (savedEmail.cost * 1.029) + 30;
  var cost = (emailRateAndStripe / 100).toFixed(2);
  var paymentInstructions = 'Your recipient requires $' + cost + ' to receive emails. Pay here: ';
  var paymentUrl = 'https://www.' + domain + '/pay/' + savedEmail._id;
  module.exports.sendEmail({
    to: JSON.parse(savedEmail.email).from,
    from: 'jenkins@' + domain,
    subject: 'Payment required',
    html: paymentInstructions + '<a href="' + paymentUrl + '" target="_blank">' + paymentUrl + '</a>.', // TODO: add original email for the payer
    text: paymentInstructions + paymentUrl + ' .'
  });
};

module.exports = {
  sendEmail: function (message, callback) {
    callback = callback || printAsyncResult;
    sendgrid.send(message, callback);
  },

  receive: function (req, res, next) {
    var form = new formidable.IncomingForm();
    var email = {};
    form.parse(req, function (error, fields) {
      if (error) {
        res.sendStatus(400);
      } else {
        email.to = JSON.parse(fields.envelope).to;
        email.from = fields.from.split('<')[1].split('>')[0];
        email.subject = fields.subject;
        email.html = fields.html;
        email.text = fields.text;
        email.files = fields.files;
        req.email = email;
        res.sendStatus(201);
        next();
      }
    });
  },

  verify: function (req) {
    var email = req.email;
    var recipients = email.to;
    recipients.forEach(function (recipient) {
      recipient = recipient.split('@');
      if (recipient[1] === domain) {
        userController.isVip(recipient[0].toLowerCase(), email.from)
          .then(function (forwardAddress) {
            if (forwardAddress === null) {
              module.exports.store(email, recipient[0].toLowerCase());
            } else {
              email.to = [forwardAddress];
              module.exports.sendEmail(email);
            }
          });
      }
    });
  },

  store: function (email, recipient, callback) {
    callback = callback || requestPayment;
    userController.getRate(recipient)
      .then(function (rate) {
        Escrow.create({email: JSON.stringify(email), recipient: recipient, cost: rate}, function (error, savedEmail) {
          if (error) {
            console.log(error);
          } else {
            callback(savedEmail);
          }
        });
      });
  },

  findEmailInEscrow: function (req, res, next) {
    var escrowId = req.params.id;
    Escrow.findOne({_id: escrowId}, function (error, escrow) {
      if (error) {
        res.sendStatus(403);
      } else {
        req.escrow = escrow;
        next();
      }
    });
  },

  findAndPayUserFromEscrow: function (req, res, next) {
    var cost = Math.floor(req.escrow.cost * payoutRatio);
    User.findOneAndUpdate({username: req.escrow.recipient}, {$inc: {balance: cost}}, function (error, user) {
      if (error) {
        res.sendStatus(403);
      } else {
        req.user = user.toJSON();
        next();
      }
    });
  },

  releaseFromEscrow: function (req, res) {
    var email = JSON.parse(req.escrow.email);
    email.to = [req.user.forwardEmail];
    module.exports.sendEmail(email);
    Escrow.findOneAndUpdate({_id: req.params.id}, {paid: true}, printAsyncResult);
    res.redirect('/');
  },

  fetchEscrows: function (req, res) {
    Escrow.find({recipient: req.user.username}, function (error, emails) {
      if (error) {
        console.log(error);
        res.status(400).send(error);
      } else {
        var data = {
          user: req.user,
          escrow: emails
        };
        res.status(201).send(data);
      }
    });
  }

};
