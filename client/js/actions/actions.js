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
  },

  logout: function () {
    APIUtils.logout();
  },

  updateVips: function (contacts) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_VIPS,
      add: contacts.add,
      remove: contacts.remove
    });

    APIUtils.updateVips(contacts.add, contacts.remove);
  },

  updatePassword: function (password) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_PASSWORD,
      password: password
    });

    APIUtils.updatePassword(password);
  },

  updateRate: function (rate) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_RATE,
      rate: rate
    });

    APIUtils.updateRate(rate);
  },

  updateForwardEmail: function (newForwardEmail) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_EMAIL,
      forwardEmail: newForwardEmail
    });

    APIUtils.updateEmail(newForwardEmail);
  }

};


module.exports = AppActions;
