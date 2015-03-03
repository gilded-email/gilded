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

  getDashboardInfo: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.GET_DASHBOARD_INFO
    });

    APIUtils.getUserDashboardInfo();
  },

  logout: function () {
    APIUtils.logout();
  },

// VIP page

  updateVips: function (contacts) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_VIPS,
      add: contacts.add,
      remove: contacts.remove
    });

    APIUtils.updateVips(contacts.add, contacts.remove);
  },

  removeVIPs: function (contacts) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.REMOVE_VIPS,
        contacts: contacts
    });

    APIUtils.removeVIPs(contacts);
  },


// Account Settings

  updatePassword: function (oldPassword, newPassword) {
    APIUtils.updatePassword(oldPassword, newPassword);
  },

  updateForwardEmail: function (newForwardEmail) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_EMAIL,
      forwardEmail: newForwardEmail
    });

    APIUtils.updateEmail(newForwardEmail);
  },

// Payments Settings

  updateRate: function (rate) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_RATE,
      rate: rate
    });

    APIUtils.updateRate(rate);
  },

  addCard: function (card) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_CARD,
      card: card
    });

    APIUtils.addCard(card);
  },

  withdraw: function () {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.WITHDRAW
    });

    APIUtils.withdraw();
  },

// Forgot Account Details

  forgotUsername: function (email) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.FORGOT_USERNAME
    });

    APIUtils.forgotUsername(email);
  },

  forgotPassword: function (username) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.FORGOT_PASSWORD
    });

    APIUtils.forgotPassword(username);

  },

  resetPassword: function(resetToken, newPassword) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.RESET_PASSWORD
    });

    APIUtils.resetPassword(resetToken, newPassword);
  }

};


module.exports = AppActions;
