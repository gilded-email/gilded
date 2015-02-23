var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');
var request = require('superagent');
var EventEmitter = require('events').EventEmitter;
var cookie = require('cookie');
var _ = require('lodash');

var CHANGE_EVENT = "change";

var _userVIPs = [];
var _userEmails = {};
var _userSettings = {};

/*eslint-disable */
var fakeEmails = [
  {"_id":"1","email":"{\"to\":[\"you@gilded.club\"],\"from\":\"welcome@gilded.club\",\"subject\":\"Welcome to Gilded\",\"html\":\"<h1>Welcome to Gilded!</h1>\",\"text\":\"Thanks for signing up with Gilded. Enjoy!\"}","recipient":"welcome","__v":0,"cost":1,"paid":true,"sentDate":"2015-02-22T00:11:07.123Z"},
  {"_id":"54e67b9b65379647526ddc60","email":"{\"to\":[\"tests@g.mtm.gs\"],\"from\":\"gildedtest@dsernst.com\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":100,"paid":false,"sentDate":"2015-02-20T00:11:07.123Z"},
  {"_id":"54e67b9be60a837653ab668f","email":"{\"envelope\":\"{\\\"to\\\":[\\\"tests@g.mtm.gs\\\"]}\",\"from\":\"Tester Guy <gildedtest@dsernst.com>\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":500,"paid":false,"sentDate":"2015-02-20T00:11:07.359Z"}
];
/*eslint-enable */


var _logUserIn = function(userData) {
  _userEmails = fakeEmails; // userData.escrow;
  _userVIPs = userData.user.vipList;
  _userSettings = {
    balance: userData.user.balance,
    forwardEmail: userData.user.forwardEmail,
    password: userData.user.password,
    rate: userData.user.rate
  };
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

var AppStore = _.extend({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener:function(callback){
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

  getUserData: function() {
    var info = {};
    info.userEmails = _userEmails;
    info.userVIPs = _userVIPs;
    info.userSettings = _userSettings;
    return info;
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.LOGIN_USER:
        break;

      case AppConstants.SIGNUP_USER:
        break;

      case AppConstants.USER_LOGGED_IN:
        _logUserIn(payload.action.userData);
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
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
