var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

module.exports = {
  userLoggedIn: function (res) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_IN,
      res: res
    });
  },

  userLoggedOut: function(res) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_OUT,
      res: res
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

  addUserCard: function (status, last4) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.ADD_CARD_SUCCESS,
      status: status,
      last4: last4
    });
  },

  updateBalance: function (balance) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_BALANCE,
      balance: balance
    });
  },

// Forgot Account Details
  forgottenUsernameEmailVerification: function (status) {
    var userForgotUsername = {
      verificationSent: false,
      verificationError: false
    };

    if (status === 400) {
      userForgotUsername.verificationError = true;
    } else if (status === 201) {
      userForgotUsername.verificationSent = true;
    }

    AppDispatcher.handleViewAction({
      actionType: AppConstants.FORGOTTEN_USERNAME_EMAIL_VERIFICATION,
      forgotUsername: userForgotUsername
    });
  },

  forgottenPasswordEmailVerification: function (status) {
    var userForgotPassword = {
      verificationSent: false,
      verificationError: false
    };

    if (status === 400) {
      userForgotPassword.verificationError = true;
    } else if (status === 201) {
      userForgotPassword.verificationSent = true;
    }

    AppDispatcher.handleViewAction({
      actionType: AppConstants.FORGOTTEN_PASSWORD_EMAIL_VERIFICATION,
      forgotPassword: userForgotPassword
    });
  },

  resetPasswordConfirmation: function (status) {
    var userResetPassword = {
      resetPasswordSuccess: false,
      resetPasswordFailure: false
    };

    if (status === 400) {
      userResetPassword.resetPasswordFailure = true;
    } else if (status === 201) {
      userResetPassword.resetPasswordSuccess = true;
    }

    AppDispatcher.handleViewAction({
      actionType: AppConstants.RESET_PASSWORD_CONFIRMATION,
      resetPassword: userResetPassword
    });
  }
};
