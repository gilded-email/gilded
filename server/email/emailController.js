var fs = require('fs');
var path = require('path');
var jade = require('jade');
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var formidable = require('formidable');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var db = require('../../db/db.js'); // mongoose.connect object
var Escrow = require('./emailModel.js');
var User = require('../user/userModel.js');
var userController = require('../user/userController.js');

var domain = process.env.DOMAIN;
var payoutRatio = 0.7;
Grid.mongo = mongoose.mongo;

var printAsyncResult = function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
};

var requestPayment = function (savedEmail) {
  var sender = JSON.parse(savedEmail.email).from;
  var emailRateAndStripe = (savedEmail.cost * 1.029) + 30;
  var cost = (emailRateAndStripe / 100).toFixed(2);
  var paymentUrl = 'https://www.' + domain + '/pay/' + savedEmail._id;
  fs.readFile(path.join(__dirname, '/../../views/jenkins.jade'), 'utf8', function (error, data) {
    if (error) {
      console.log('Welcome Email error: ', error);
    } else {
      var compiledHtml = jade.compile(data);
      var html = compiledHtml({recipient: savedEmail.recipient, cost: cost, subject: JSON.parse(savedEmail.email).subject, body: JSON.parse(savedEmail.email).html, url: paymentUrl, from: sender});
      var paymentRequestEmail = {
        to: sender,
        from: 'jenkins@' + domain,
        subject: 'Payment required to reach ' + savedEmail.recipient + '@' + domain,
        html: html
      };
      module.exports.sendEmail(paymentRequestEmail);
    }
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
    form.parse(req, function (error, fields, files) {
      if (error) {
        res.sendStatus(400);
      } else {
        email = fields;
        delete email.headers; //remove headers because sendgrid attaches new ones
        email.to = JSON.parse(fields.envelope).to;
        email.from = fields.from.split('<')[1].split('>')[0];
        email.subject = fields.subject;
        email.html = fields.html;
        email.text = fields.text;
        email.files = [];
        for (var i = 1; i <= +fields.attachments; i++) {
          var attachmentInfo = JSON.parse(fields['attachment-info']);
          (function (index) {
            fs.readFile(files['attachment' + index].path, function (error, data) {
              if (error) {
                console.log('Attachment readFile error', error);
                res.status(400).send(error);
              } else {
                var attachmentIndex = 'attachment' + index;
                var filename = attachmentInfo[attachmentIndex].name;
                email.files.push({filename: filename, content: data});
                if (email.files.length === +fields.attachments) {
                  req.email = email;
                  res.sendStatus(201);
                  next();
                }
              }
            });
          })(i);
        }
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
