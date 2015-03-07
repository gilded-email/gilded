var domain = process.env.DOMAIN;
var emailController = require('../email/emailController.js');

module.exports = {
  contact: function (req, res) {
    var message = {
      to: 'admin@' + domain,
      from: req.body.sender,
      fromname: req.body.name,
      replyto: req.body.sender,
      subject: 'Gilded Contact Form: ' + req.body.subject,
      text: req.body.message
    };
    emailController.sendEmail(message);
    res.sendStatus(200);
  }
};
