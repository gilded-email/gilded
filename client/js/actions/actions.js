var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');
var APIUtils = require('../utils/APIUtils');

var AppActions = {
  loginUser: function (user) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN_USER,
      username: user.username,
      password: user.password
    });

    APIUtils.loginUser(user.username, user.password);
  },

  signupUser: function (user) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.SIGNUP_USER,
      username: user.username,
      email: user.email,
      password: user.password
    });

    APIUtils.signupUser(user.username, user.email, user.password);
  }

};


module.exports = AppActions;
