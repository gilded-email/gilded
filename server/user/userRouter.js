var mongoose = require('mongoose');
// var db = require('../db/db');
// var userHandler = require('./user/userHandler');

var userRouter = {};

userRouter.signUp = function (req, res) {
  var userData = {
    username: req.body.username,
    password: req.body.password,
    address: req.body.address //the request email address
  };
  userHandler.create(userData)
    .then(function (user) {
      res.redirect('/profile');
    })
    .catch(function (err) {
      res.send(err); //if the email address is already taken, prompt the user to choose another one
    });
};

userRouter.signIn = function (req, res) {
  var userData = {
    username: req.body.username,
    password: req.body.password
  };
  userHandler.signIn(userData)
    .then(function (user) {
      res.redirect('/dashboard');
    })
    .catch(function () {
      res.sendStatus(403);
    });
};

module.exports = userRouter;
