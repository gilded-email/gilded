var serverActions = require('../actions/serverActions.js');
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
        serverActions.userLoggedIn(res.body);
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
        serverActions.userLoggedIn(res.body);
      });
  },

  logout: function () {
    request
      .post(API_ROOT + 'logout')
      .end(function (error, res) {
        if (error) {
          console.log('logout error ', error);
          return error;
        }
        serverActions.userLoggedOut();
      });
  },

// VIP

  updateVips: function (contacts) {
    request
      .post(API_ROOT + 'user/vipList')
      .send({add: contacts})
      .end(function (error, res) {
        if (error) {
          console.log('VIP update error: ', error);
          return error;
        }
        serverActions.updateUserVIPs(res.body);
      });
  },

  removeVIPs: function (contacts) {
    request
      .put(API_ROOT + 'user/vipList')
      .send({remove: contacts})
      .end(function (error, res) {
        if (error) {
          console.log('VIP update error: ', error);
          return error;
        }
        console.log('removed ', contacts);
        console.log(res.body);
        serverActions.updateUserVIPs(res.body);
      });
  },

// Settings

  updateEmail: function (email) {
    request
      .put(API_ROOT + 'user/settings/email')
      .send({forwardEmail: email})
      .end(function (error, res) {
        if (error) {
          console.log('email update error: ', error);
          return error;
        }
        serverActions.updateUserEmail(res.body);
      });
  },

  updatePassword: function (password) {
    request
      .put(API_ROOT + 'user/settings/password')
      .send({password: password})
      .end(function (error, res) {
        if (error) {
          console.log('password update error: ', error);
          return error;
        }
        serverActions.updateUserPassword(res.body);
      });
  },

  updateRate: function (rate) {
    request
      .put(API_ROOT + 'user/settings/rate')
      .send({rate: rate})
      .end(function (error, res) {
        if (error) {
          console.log('rate update error: ', error);
          return error;
        }
<<<<<<< HEAD
        serverActions.updateUserRate(res.body);
=======
        console.log('this is rate response from api utils', res.text);
        Actions.updateUserRate(JSON.parse(res.text));
>>>>>>> logout routing
      });
  }

};

module.exports = api_utils;
