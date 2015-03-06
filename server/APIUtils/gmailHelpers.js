var request = require('superagent');
var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://' + process.env.DOMAIN + '/oauth2callback/gmail');

google.options({ auth: oauth2Client });

var scopes = [
  'https://www.googleapis.com/auth/contacts.readonly'
];

var url = oauth2Client.generateAuthUrl({
  scope: scopes
});

var gmailHelpers = {

  getAuthCode: function (req, res) {
    res.redirect(url);
  },

  getContacts: function(req, res, next){
    var code = req.query.code;
    oauth2Client.getToken(code, function(error, tokens) {
      if (error) {
        console.log('Error getting user contacts', error);
        res.status(400).send(error);
      } else {
        var accessToken = tokens.access_token;
        request
          .get('https://www.google.com/m8/feeds/contacts/default/full?access_token=' + accessToken + '&alt=json&max-results=9999')
          .end(function (error2, response) {
            if (error) {
              console.log('Error getting user contacts from gooogle', error2);
              res.status(400).send(error);
            }
            var contacts = JSON.parse(response.text).feed.entry.filter(function (entry) {
              return entry.gd$email;
            }).map(function (entry) {
              return entry.gd$email[0].address;
            });
            req.body.add = contacts;
            next();
          });
      }
    });
  }
};

module.exports = gmailHelpers;
