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
  rate: 100
};
var _newCard = {
  success: false,
  failure: false,
  last4: null
};
var _userErrors = {
  login: false,
  signup: false
};

var _userForgotUsername = {
  verificationSent: false,
  verificationError: false
};

/*eslint-disable */
var fakeEmails = [
  {"_id":"1","email":"{\"to\":[\"you@gilded.club\"],\"from\":\"welcome@gilded.club\",\"subject\":\"Welcome to Gilded\",\"html\":\"<h1>Welcome to Gilded!</h1>\",\"text\":\"Thanks for signing up with Gilded. Enjoy!\"}","recipient":"welcome","__v":0,"cost":1,"paid":true,"sentDate":"2015-02-22T00:11:07.123Z"},
];
/*eslint-enable */


var _logUserIn = function(res) {
  if (!res.body && res.text === 'wrong password') {
    _userErrors.login = true;
  } else if (res.status === 409) {
    _userErrors.signup = true;
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

var _forgottenEmailVerification = function (status) {
  if (status === 400) {
    _userForgotUsername.verificationError = true;
  } else if (status === 201) {
    _userForgotUsername.verificationSent = true;
  }
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
    return parsedCookie.userToken && parsedCookie.userExpires > Date.now();
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

      case AppConstants.FORGOTTEN_EMAIL_VERIFICATION:
        _forgottenEmailVerification(payload.action.status, payload.action.text);
        break;
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
