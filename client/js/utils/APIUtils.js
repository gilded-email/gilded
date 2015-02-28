var serverActions = require('../actions/serverActions.js');
var request = require('superagent');

var API_ROOT = '/api/';

var apiUtils = {

  loginUser: function (username, password) {
    request
      .post(API_ROOT + 'login')
      .send({username: username, password: password})
      .end(function (error, res) {
        if (error) {
          console.log('login error ', error);
          return error;
        }
        serverActions.userLoggedIn(res);
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
        else if (res.body.error) {
          console.log('Signup Error: ', res.body.error);
        }
        serverActions.userLoggedIn(res);
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
        serverActions.userLoggedOut(res);
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

  getUserDashboardInfo: function () {
    request
      .get(API_ROOT + 'user/dashboard')
      .end(function (error, res) {
        if (error) {
          console.log('dashboard info error', error);
          return error;
        }
        serverActions.getUserDashboardInfo(res.body);
      });
  },

// Payments

  updateRate: function (rate) {
    request
      .put(API_ROOT + 'user/settings/rate')
      .send({rate: rate})
      .end(function (error, res) {
        if (error) {
          console.log('rate update error: ', error);
          return error;
        }
        serverActions.updateUserRate(res.body);
      });
  },

  addCard: function (card) {
    request
      .post(API_ROOT + 'user/settings/card')
      .send({card: card})
      .end(function (error, res) {
        if (error) {
          console.log('card failed to post: ', error);
          return error;
        }
        var last4 = res.body.last4;
        serverActions.addUserCard(res.status, last4);
      });
  },

  withdraw: function () {
    console.log('withdrawing');
    request
      .post(API_ROOT + 'user/withdraw')
      .end(function (error, res) {
        serverActions.updateBalance(res.body.balance);
      });
  },

// Username and Password Help

  forgotUsername: function (email) {
    request
      .post(API_ROOT + 'user/forgotusername')
      .send({email: email})
      .end(function (error, res) {
        if (error) {
          console.log(error);
        }
        var status = res.status;
        var text = res.text;
        serverActions.forgottenUsernameEmailVerification(status, text);
      });
  },

  forgotPassword: function (username) {
    request
      .post(API_ROOT + 'user/forgotpassword')
      .send({username: username})
      .end(function (error, res) {
        if (error) {
          console.log(error);
          return;
        }
        serverActions.forgottenPasswordEmailVerification(res.status);
      });
  },

  resetPassword: function (resetToken, newPassword) {
    request
      .put('/resetpassword/' + resetToken)
      .send({password: newPassword})
      .end(function (error, res) {
        if (error) {
          console.log(error);
          return;
        }
        serverActions.resetPasswordConfirmation(res.status);
      });
  }

};

module.exports = apiUtils;
