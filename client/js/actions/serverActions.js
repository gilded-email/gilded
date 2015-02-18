var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

module.exports = {
  userLoggedIn: function (userData) {
    // console.dir(userData);
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_IN,
      userData: userData
    });
  },

  updateUser: function (userData) {
    // console.dir(userData);
    AppDispatcher.handleViewAction({
      actionType: AppConstants.UPDATE_USER,
      userData: userData
    });
  }
};
