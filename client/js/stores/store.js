var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');
var EventEmitter = require('events').EventEmitter;
var cookie = require('cookie');
var _ = require('lodash');

var CHANGE_EVENT = 'change';

var _userVIPs = [];
var _userEmails = {};
var _userSettings = {
  balance: 0,
  rate: 0
};
var _newCard = {
  success: false,
  failure: false,
  last4: null
};
var _userErrors = {
  login: false,
  signup: false,
  signupError: null
};

var _userForgotUsername = {
  verificationSent: false,
  verificationError: false
};

var _userForgotPassword = {
  verificationSent: false,
  verificationError: false
};

var _userResetPassword = {
  resetPasswordSuccess: false,
  resetPasswordFailure: false
};

/*eslint-disable */
var fakeEmails = [
  {"_id":"1","email":"{\"to\":[\"you@gilded.club\"],\"from\":\"welcome@gilded.club\",\"subject\":\"Welcome to Gilded\",\"html\":\"<h2>Welcome to Gilded!</h2><p>Thanks for signing up with Gilded.</p><p>This is where you'll see all incoming email.</p><p>Enjoy!</p>\",\"text\":\"Thanks for signing up with Gilded. Enjoy!\"}","recipient":"welcome","__v":0,"cost":0,"paid":false,"sentDate":"2015-02-02T00:12:34.567Z"},
];
/*eslint-enable */


var _logUserIn = function(res) {
  if (!res.body && res.text === 'wrong password') {
    _userErrors.login = true;
  } else if (res.status === 409) {
    _userErrors.signupError = res.body.error;
  } else if (res.body) {
    var userData = res.body;
    _userEmails = fakeEmails; // userData.escrow;
    _userVIPs = userData.user.vipList;
    _userSettings = {
      balance: userData.user.balance,
      forwardEmail: userData.user.forwardEmail,
      password: userData.user.password,
      rate: userData.user.rate
    };
  }
};

var _logUserOut = function() {
  _userVIPs = [];
  _userEmails = [];
  _userSettings = {};
};

var _updateDashboardInfo = function(userData) {
  // Concating Fake Data for testing
  _userEmails = userData.escrow.concat(fakeEmails);
  _userVIPs = userData.user.vipList;
  _userSettings = {
    balance: userData.user.balance,
    forwardEmail: userData.user.forwardEmail,
    password: userData.user.password,
    rate: userData.user.rate
  };
  _newCard.last4 = userData.user.last4;
};

var _updateVIPList = function(VIPList) {
  _userVIPs = VIPList;
};

var _updateUserEmail = function(email) {
  _userSettings.forwardEmail = email;
};

var _updateUserPassword = function(password) {
  _userSettings.password = password;
};

var _updateUserRate = function(rate) {
  _userSettings.rate = rate;
};

var _addCard = function (status, last4) {
  if (status === 201) {
    _newCard.success = true;
  } else if (status === 400 ) {
    _newCard.failure = true;
  }
  if (last4) {
    _newCard.last4 = last4;
  }
};

var _updateBalance = function (balance) {
  _userSettings.balance = balance;
};

var _forgottenUsernameEmailVerification = function (forgotUsername) {
  _userForgotUsername = forgotUsername;
};

var _forgottenPasswordEmailVerification = function (forgotPassword) {
  _userForgotPassword = forgotPassword;
};

var _resetPasswordConfirmation = function (resetPassword) {
  _userResetPassword = resetPassword;
};

var AppStore = _.extend({}, EventEmitter.prototype, {
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  },

  isUserLoggedIn: function() {
    var parsedCookie = cookie.parse(document.cookie);
    return parsedCookie.token && parsedCookie.expiration > Date.now();
  },

  getUserSettings: function() {
    return _userSettings;
  },

  getUserVIPs: function() {
    return _userVIPs;
  },

  getUserEmails: function() {
    return _userEmails;
  },

  getUserErrors: function() {
    return _userErrors;
  },

  getUserData: function() {
    var info = {};
    info.userEmails = _userEmails;
    info.userVIPs = _userVIPs;
    info.userSettings = _userSettings;
    info.userCard = _newCard;
    return info;
  },

  getForgotUsernameDetails: function() {
    return _userForgotUsername;
  },

  resetForgotUsernameDetails: function() {
    _userForgotUsername = {
      verificationSent: false,
      verificationError: false
    };
  },

  getForgotPasswordDetails: function() {
    return _userForgotPassword;
  },

  resetForgotPasswordDetails: function() {
    _userForgotPassword = {
      verificationSent: false,
      verificationError: false
    };
  },

  getResetPasswordDetails: function() {
    return _userResetPassword;
  },

  resetResetPasswordDetails: function() {
    _userResetPassword = {
      resetPasswordSuccess: false,
      resetPasswordFailure: false
    };
  },

  resetUserErrors: function() {
    _userErrors = {
      login: false,
      signup: false
    };
  },

  resetCard: function() {
    _newCard = {
      success: false,
      failure: false
    };
  },

  dispatcherIndex: AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.LOGIN_USER:
        break;

      case AppConstants.SIGNUP_USER:
        break;

      case AppConstants.USER_LOGGED_IN:
        _logUserIn(payload.action.res);
        break;

      case AppConstants.UPDATE_USER_VIPS:
        _updateVIPList(payload.action.vipList);
        break;

      case AppConstants.UPDATE_USER_EMAIL:
        _updateUserEmail(payload.action.forwardEmail);
        break;

      case AppConstants.UPDATE_USER_PASSWORD:
        _updateUserPassword(payload.action.password);
        break;

      case AppConstants.UPDATE_USER_RATE:
        _updateUserRate(payload.action.rate);
        break;

      case AppConstants.USER_LOGGED_OUT:
        _logUserOut();
        break;

      case AppConstants.GET_USER_DASHBOARD_INFO:
        _updateDashboardInfo(payload.action.userData);
        break;

      case AppConstants.ADD_CARD:
        break;

      case AppConstants.ADD_CARD_SUCCESS:
        _addCard(payload.action.status, payload.action.last4);
        break;

      case AppConstants.WITHDRAW:
        break;

      case AppConstants.UPDATE_BALANCE:
        _updateBalance(payload.action.balance);
        break;

      case AppConstants.FORGOTTEN_USERNAME_EMAIL_VERIFICATION:
        _forgottenUsernameEmailVerification(payload.action.forgotUsername);
        break;

      case AppConstants.FORGOTTEN_PASSWORD_EMAIL_VERIFICATION:
        _forgottenPasswordEmailVerification(payload.action.forgotPassword);
        break;

      case AppConstants.RESET_PASSWORD_CONFIRMATION:
        _resetPasswordConfirmation(payload.action.resetPassword);
        break;
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
