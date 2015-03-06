var request = require('superagent');
var randomstring = require("randomstring");

var yahooHelpers = {

  getRequestToken: function (req,res) {
    var timeStamp = Date.now();
    var nonce = randomstring.generate(7);
  },
  https://api.login.yahoo.com/oauth/v2/
    get_request_token?oauth_nonce=ce2130523f788f313f76314ed3965ea6
    &oauth_timestamp=1202956957
    &oauth_consumer_key=123456891011121314151617181920
    &oauth_signature_method=plaintext
    &oauth_signature=abcdef
    &oauth_version=1.0
    &xoauth_lang_pref="en-us"
    &oauth_callback="http://yoursite.com/callback"

    request
    .get('')
};

module.exports = yahooHelpers;
