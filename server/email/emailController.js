var Promise = require('bluebird');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var formidable = require('formidable');
var userController = require('../user/userController.js');
var escrow = require('./emailModel.js');
var domain = process.env.DOMAIN;

var sendEmail = function (message) {
  sendgrid.send(message, function (error, results) {
    if (error) {
      console.log(error);
    } else {
      console.log(results.message);
    }
  });
};

var requestPayment = function (recipient, emailId) {
  sendEmail({
    to: recipient,
    from: 'jenkins@' + domain,
    subject: 'Payment required',
    html: 'Your recipient requires $0.25 to receive emails. Pay here: <a href="http://' + domain + '/pay/' + emailId + '" target="_blank">http://' + domain + '/pay/' + emailId + '</a>.',
    text: 'Your recipient requires $0.25 to receive emails. Pay here: http://' + domain + '/pay/' + emailId + ' .'
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
            escrow.create({email: JSON.stringify(email)}).then(function (savedEmail) {
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

  payment: function (req, res) {
    var escrowId = req.params.id;

  }
};
