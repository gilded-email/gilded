var Promise = require('bluebird');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
var formidable = require('formidable');
var email = {};

email.receive = function (req, res, next) {
  var form = new formidable.IncomingForm();
  var emailData = {};
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.sendStatus(400);
    } else {
      emailData.to = JSON.parse(fields.envelope).to;
      emailData.from = JSON.parse(fields.envelope).from;
      emailData.subject = fields.subject;
      emailData.html = fields.html;
      emailData.text = fields.text;
      emailData.files = files;
      req.emailData = emailData;
      next();
    }
  });
};

email.verify = function (req, res) {
  var emailData = req.emailData;
  var fetchUser = function () {
    // fetch from db our user by gilded email
  };

  // see if sender belongs to user's verified list
    // if yes
      // use sendGrid to swap out Gilded with forwarding address
      // send along message
    // if no
      // reply with a $ request email to orig sender
      // store orig email in escrow
};

  // emailData.to = 'neil.lokare@gmail.com';
  // console.log("New Email: ", emailData);
  // sendgrid.send(emailData, function (err, json) {
  //   if (err) {
  //     return err;
  //   } else {
  //     console.log(json);
  //   }
  // });


module.exports = email;
