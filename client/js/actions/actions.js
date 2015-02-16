var AppConstants = require('../constants/constants.js');
var AppDispatcher = require('../dispatchers/dispatcher.js');

var AppActions = {
  loginUser: function (user) {
    AppDispatcher.handleViewAction({
      actionType: AppConstants.LOGIN_USER,
      username: user.username,
      password: user.password
    })
  }
};

module.exports = AppActions;
