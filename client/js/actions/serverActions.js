var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatcher/dispatcher.js');

module.exports = {
  userLoggedIn: function (userData) {
    console.log(userData);
    AppDispatcher.handleViewAction({
      actionType: AppConstants.USER_LOGGED_IN,
      userData: userData
    });
  }
};
