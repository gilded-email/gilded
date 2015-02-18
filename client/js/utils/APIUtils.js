var Actions = require('../actions/serverActions.js');
var request = require('superagent');

var API_ROOT = "/api/";

var api_utils = {

  loginUser: function (username, password) {
    request
      .post(API_ROOT + 'login')
      .send({username: username, password: password})
      .end(function (error, res) {
        if (error) {
          console.log('login error ', error);
          return error;
        }
        console.log(res);
        Actions.userLoggedIn(JSON.parse(res.text));
      });
  },

  signupUser: function (username, email, password) {
    request
      .post(API_ROOT + 'join')
      .send({username: username, forwardEmail: email, password: password})
      .end(function (error, res) {
        if (error) {
          console.log('signup error ', error);
          return error;
        }
        Actions.userLoggedIn(res.text);
      });
  }

};

module.exports = api_utils;
