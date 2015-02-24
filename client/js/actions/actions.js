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


// Settings Page

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
  },

  addCard: function (card) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_CARD,
      card: card
    });

    APIUtils.addCard(card);
  }

};


module.exports = AppActions;
