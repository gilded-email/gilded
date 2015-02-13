var mongoose = require('mongoose');
var userModel = require('./userModel.js');

module.exports = {
  signUp: function (req, res) {
    var userData = {
      username: req.body.username,
      password: req.body.password,
      address: req.body.forwardEmail
    };
    userModel.create(userData)
      .then(function () {
        res.redirect('/profile');
      })
      .catch(function (err) {
        res.send(err); //if the email address is already taken, prompt the user to choose another one
      });
  },

  signIn: function (req, res) {
    var userData = {
      username: req.body.username,
      password: req.body.password
    };
    userModel.signIn(userData)
      .then(function () {
        res.redirect('/dashboard');
      })
      .catch(function () {
        res.sendStatus(403);
      });
  }
}
