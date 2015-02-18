var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');
var request = require('superagent');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = "change";

var _userLoggedIn = false;
var _userVIPs;
var _userHistory;
var _userSettings;

var _logUserIn = function(userData) {
  _userVIPs = userData.vipList;
  _userSettings = {
    balance: userData.balance,
    forwardEmail: userData.forwardEmail,
    password: userData.password
  };
  _userLoggedIn = true;
}

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
    return _userLoggedIn;
  },

  getUserSettings: function() {
    return _userSettings;
  },

  getUserVIPs: function() {
    return _userVIPs;
  },

  getUserHistory: function() {
    return _userHistory;
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
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
