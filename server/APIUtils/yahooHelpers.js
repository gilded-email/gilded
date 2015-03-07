var request = require('superagent');
var randomstring = require('randomstring');
var url = require('url');
var NodeCache = require('node-cache');
var parseString = require('xml2js').parseString;
var myCache = new NodeCache( {stdTTL: 180, checkperiod: 180});

var yahooHelpers = {

  getRequestToken: function (req, res, next) {
    var nonce = randomstring.generate(7);
    var timeStamp = Date.now();
    var consumerKey = process.env.YAHOO_CONSUMER_KEY;
    var signatureMethod = 'plaintext';
    var signature = process.env.YAHOO_CONSUMER_SECRET;
    var languagePreference = 'en-us';
    var callback = 'http://' + process.env.DOMAIN + '/oauth2callback/yahoo';

    request
    .get(
      'https://api.login.yahoo.com/oauth/v2/get_request_token' +
      '?oauth_nonce=' + nonce +
      '&oauth_timestamp=' + timeStamp +
      '&oauth_consumer_key=' + consumerKey +
      '&oauth_signature_method=' + signatureMethod +
      '&oauth_signature='+ signature + '%26' +
      '&xoauth_lang_pref=' + languagePreference +
      '&oauth_callback=' + callback
      )
    .end(function (error, resp) {
      if (error) {
        console.log('yahoo request token error', error);
        res.send(error);
      } else {
        var parsedResponse = resp.text.split('&').reduce(function(previousObject, currentElement) {
          var keyAndValue = currentElement.split('=');
          previousObject[keyAndValue[0]] = keyAndValue[1];
          return previousObject;
        }, {});
        myCache.set(parsedResponse.oauth_token, parsedResponse.oauth_token_secret);
        req.oauthToken = parsedResponse.oauth_token;
        next();
      }
    });
  },

  getUserAuth: function (req, res) {
    request
    .get('https://api.login.yahoo.com/oauth/v2/request_auth?oauth_token=' + req.oauthToken)
    .end(function(error, resp) {
      if (error) {
        console.log('yahoo user auth error', error);
        res.send(error);
      } else {
        var yahooRedirect = resp.redirects[0];
        res.tokenSecret = req.tokenSecret;
        res.redirect(yahooRedirect);
      }
    });
  },

  getAccessToken: function (req, res, next) {
    var nonce = randomstring.generate(7);
    var urlParts = url.parse(req.url, true).query;
    var oauthToken = urlParts.oauth_token;
    var oauthVerifier = urlParts.oauth_verifier;
    var tokenSecret = myCache.get(oauthToken)[oauthToken];
    request
    .get(
      'https://api.login.yahoo.com/oauth/v2/get_token' +
      '?oauth_consumer_key=' + process.env.YAHOO_CONSUMER_KEY +
      '&oauth_signature_method=plaintext' +
      '&oauth_verifier=' + oauthVerifier +
      '&oauth_token=' + oauthToken +
      '&oauth_timestamp=' + Date.now() +
      '&oauth_nonce=' + nonce +
      '&oauth_signature=' + process.env.YAHOO_CONSUMER_SECRET + '%26' + tokenSecret
      )
    .end(function (error, resp) {
      if (error) {
        console.log('yahoo access token error', error);
        res.send(error);
      } else {
        var parsedResponse = resp.text.split('&').reduce(function(previousObject, currentElement) {
          var keyAndValue = currentElement.split('=');
          previousObject[keyAndValue[0]] = keyAndValue[1];
          return previousObject;
        }, {});
        req.yahooGUID = parsedResponse.xoauth_yahoo_guid;
        req.accessToken = parsedResponse.oauth_token;
        next();
      }
    });
  },

  getContacts: function (req, res, next) {
    request
    .get('https://social.yahooapis.com/v1/user/' + req.yahooGUID + '/contacts;out=email;')
    .set('Authorization', 'Bearer ' + req.accessToken)
    .set('rejectUnauthorized', false)
    .set('content-type', 'application/json')
    .set('count', 'max')
    .end(function (error, resp) {
      if (error) {
        console.log('error when getting contacts', error);
        res.send(error);
      } else {
        var body = '';
        resp.res.on('data', function(chunk) {
          body += chunk;
        });
        resp.res.on('end', function() {
          parseString(body, function (err, result) {
            if (err) {
              console.log('error getting yahoo contacts data', err);
              res.send(err);
            }
            var yahooContacts = result.contacts.contact;
            var yahooContactEmails = yahooContacts.filter(function(contact) {
              return contact.fields;
            }).map(function(contact) {
              return contact.fields[0].value[0];
            });
            req.body.add = yahooContactEmails;
            next();
          });
        });
      }
    });
  }

};

module.exports = yahooHelpers;
