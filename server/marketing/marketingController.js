var MarketingModel = require('./marketingModel.js');
var emailController = require('../email/emailController.js');

module.exports = {
  signup: function (req, res) {
    var email = req.body.email;
    var marketingEmail = new MarketingModel({email: email});
    marketingEmail.save(function (error) {
      if (error) {
        console.log('marketing signup error', error);
        res.sendStatus(409);
      } else {
        res.sendStatus(201);
        emailController.sendEmail({
          to: email,
          from: 'welcome@' + domain,
          subject: 'Welcome to Gilded',
          html: 'Thanks for your interest in <a href="http://www.gilded.club">Gilded</a>! We\'ll be sure to keep you posted when more spots open up.<br><br>In the meantime, please invite your friends to reserve their spot in line.<br><br>Thanks,<br><br>Team Gilded<br><a href="http://www.gilded.club">www.gilded.club</a>',
          text: 'Thanks for your interest in Gilded! We\'ll be sure to keep you posted when more spots open up.\n\nIn the meantime, please invite your friends to reserve their spot in line.\n\nThanks,\n\nTeam Gilded\nhttp://www.gilded.club'
        });
      }
    });
  }
};
