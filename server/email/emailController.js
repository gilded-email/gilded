var Promise = require('bluebird');
var formidable = require('formidable');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var userController = require('../user/userController.js');
var Escrow = require('./emailModel.js');
var User = require('../user/userModel.js');
var domain = process.env.DOMAIN;

var printAsyncResult = function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
};

var sendEmail = function (message) {
  sendgrid.send(message, printAsyncResult);
};

var requestPayment = function (recipient, emailId) {
  var paymentInstructions = 'Your recipient requires $0.25 to receive emails. Pay here: ';
  var paymentUrl = 'http://' + domain + '/pay/' + emailId;
  sendEmail({
    to: recipient,
    from: 'jenkins@' + domain,
    subject: 'Payment required',
    html: paymentInstructions + '<a href="' + paymentUrl + '" target="_blank">' + paymentUrl + '</a>.',
    text: paymentInstructions + paymentUrl + ' .'
  });
};

module.exports = {
  receive: function (req, res, next) {
    var form = new formidable.IncomingForm();
    var email = {};
    form.parse(req, function (error, fields) {
      if (error) {
        res.sendStatus(400);
      } else {
        console.log("fields: ", fields);
        // email = fields;
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
        userController.isVip(recipient[0], email.from).then(function (forwardEmail) {
          if (forwardEmail === null) {
            Escrow.create({email: JSON.stringify(email), recipient: recipient[0]}).then(function (savedEmail) {
              requestPayment(email.from, savedEmail._id);
            });
          } else {
            email.to = [forwardEmail];
            sendEmail(email);
          }
        });
      }
    });
  },

  release: function (req, res) {
    var escrowId = req.params.id;
    Escrow.findOne({_id: escrowId}, function (error, escrow) {
      if (error) {
        res.send(403);
      } else {
        User.findOne({username: escrow.recipient}, function (error, user) {
          if (error) {
            res.send(403);
          } else {
            var email = JSON.parse(escrow.email);
            email.to = [user.forwardEmail];
            sendEmail(email);
            Escrow.findOneAndUpdate({_id: escrowId}, {paid: true}, printAsyncResult);
            res.redirect('/'); // TODO: redirect to confirmation page
          }
        });
      }
    });
  }
};
