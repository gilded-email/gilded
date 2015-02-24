var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

module.exports = {
  userLoggedIn: function (userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_IN,
      userData: userData
    });
  },

  userLoggedOut: function() {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_OUT
    });
  },

  getUserDashboardInfo: function(userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.GET_USER_DASHBOARD_INFO,
      userData: userData
    });
  },

// VIPs

  updateUserVIPs: function (userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_USER_VIPS,
      vipList: userData.vipList
    });
  },

// Settings

  updateUserEmail: function (userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_USER_EMAIL,
      forwardEmail: userData.forwardEmail
    });
  },

  updateUserPassword: function (userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_USER_PASSWORD,
      password: userData.password
    });
  },

  updateUserRate: function (userData) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_USER_RATE,
      rate: userData.rate
    });
  },

  addUserCard: function (status) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_CARD_SUCCESS,
      status: status
    });
  }
};
