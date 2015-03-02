var fs = require('fs');
var path = require('path');
var jade = require('jade');
var formidable = require('formidable');
var BPromise = require('bluebird');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var Escrow = require('./emailModel.js');
var User = require('../user/userModel.js');
var userController = require('../user/userController.js');

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
  var sender = JSON.parse(savedEmail.email).from;
  var emailRateAndStripe = (savedEmail.cost * 1.029) + 30;
  var cost = (emailRateAndStripe / 100).toFixed(2);
  var paymentUrl = domain + '/pay/' + savedEmail._id;
  fs.readFile(path.join(__dirname, '/../../views/jenkins.jade'), 'utf8', function (error, data) {
    if (error) {
      console.log('Welcome Email error: ', error);
    } else {
      var compiledHtml = jade.compile(data);
      var html = compiledHtml({recipient: savedEmail.recipient, cost: cost, subject: JSON.parse(savedEmail.email).subject, body: JSON.parse(savedEmail.email).html, url: paymentUrl, from: sender, domain: domain});
      var paymentRequestEmail = {
        to: sender,
        from: 'jenkins@' + domain,
        fromname: 'Gilded Club',
        replyto: 'payments@' + domain,
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
        email.subject = fields.subject || '(no subject)';
        email.html = fields.html;
        email.text = fields.text;
        if (fields.attachments > 0) {
          var attachments = [];
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
                  attachments.push({filename: filename, content: data});
                  if (attachments.length === +fields.attachments) {
                    req.email = email;
                    req.attachments = attachments;
                    res.sendStatus(201);
                    next();
                  }
                }
              });
            })(i);
          }
        } else {
          req.email = email;
          res.sendStatus(201);
          next();
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
              module.exports.store(email, req.attachments, recipient[0].toLowerCase());
            } else {
              email.to = [forwardAddress];
              if (req.attachments) {
                email.files = req.attachments;
              }
              module.exports.sendEmail(email);
            }
          });
      }
    });
  },

  store: function (email, attachments, recipient, callback) {
    callback = callback || requestPayment;
      module.exports.storeAndRetrieveAttachments(attachments)
      .then(function (list) {
        userController.getRate(recipient)
          .then(function (rate) {
            Escrow.create({email: JSON.stringify(email), recipient: recipient, cost: rate, attachments: list}, function (error, savedEmail) {
              if (error) {
                console.log('Escrow storing error: ', error);
              } else {
                callback(savedEmail);
              }
            });
          });
      });
  },

  findEmailInEscrow: function (req, res, next) {
    var escrowId = req.params.id;
    Escrow.findOne({_id: escrowId}, function (error, escrow) {
      if (error) {
        console.log('Find email in escrow error', error);
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
        console.log('Updating user entry after escrow error', error);
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
    if (req.escrow.attachments.length > 0) {
      email.files = req.escrow.attachments;
    }
    delete email.attachment;
    delete email.filename;
    delete email.attachments;
    delete email['attachment-info'];
    delete email.charsets;
    delete email.dkim;
    delete email.envelope;
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
  },

  storeAndRetrieveAttachments: function (attachments) {
    var list = [];
    return new BPromise(function (resolve, reject) {
      if (!attachments) {
        resolve([]);
      } else {
        attachments.forEach(function (attachment) {
          list.push({filename: attachment.filename, content: attachment.content});
        });
        resolve(list);
      }
    });
  }

};
