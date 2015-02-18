var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');
var request = require('superagent');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = "change";

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

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.LOGIN_USER:
        break;

      case AppConstants.SIGNUP_USER:
        break;
    }

    AppStore.emitChange();

    return true;
  })
});

module.exports = AppStore;
