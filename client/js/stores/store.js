var AppDispatcher = require('../dispatcher/dispatcher');
var AppConstants = require('../constants/constants');
var request = require('superagent');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

var CHANGE_EVENT = "change";

var _loginUser = function (username, password) {
  console.log('this is the username ', username);
  console.log('this is password ', password);
  // request
  //   .post('') //TODO: post to login url
  //   .send({username: username, password: password})
  //   .end(function (error, resp) {
  //     if (error) {
  //       console.log('login error ', error);
  //       return error;
  //     }
  //     // if login is successful
  //       // send user to dashboard
  //     // else if login is unsuccessful
  //       //send user back to login page
  //   });
};

var _signupUser = function (username, email, password) {
  console.log('this is the username ', username);
  console.log('this is the email ', email);
  console.log('this is the password ', password);

  request
    .post() //TODO: post to signup url
    .send({username: username, forwardEmail: email, password: password})
    .end(function (error, resp) {
      if (error) {
        console.log('signup error ', error);
        return error;
      }
      // if signup is successful
        //send user either to login page OR dashboard
      // else 
        //send user back to signin page;
    });
};

var AppStore = _.extend({}, EventEmitter.prototype, {
  emitChange:function(){
    this.emit(CHANGE_EVENT)
  },

  addChangeListener:function(callback){
    this.on(CHANGE_EVENT, callback)
  },

  removeChangeListener:function(callback){
    this.removeListener(CHANGE_EVENT, callback)
  },

  dispatcherIndex:AppDispatcher.register(function(payload){
    var action = payload.action; // this is our action from handleViewAction
    switch(action.actionType){
      case AppConstants.LOGIN_USER:
        _loginUser(payload.action.username, payload.action.password);
        break;

      case AppConstants.SIGNUP_USER:
        _signupUser(payload.action.username, payload.action.email, payload.action.password);
        break;
    }

    AppStore.emitChange();

    return true;
  })
})

module.exports = AppStore;
