var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid')('nlokare', 'Nl110388');
var email = require('./server/email/email.js');
var user = require('./server/user/userRouter.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');

app.use(express.static(__dirname, '/client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(app.get('port'));

app.use('/inbound', email.receive); //handle all emails to application domain;

app.route('/')
  .get(function (req, res) {
    //TODO: Serve up homepage static HTML file
  })
  .post(function (req, res) {
    res.sendStatus(403);
  });

app.route('/signup')
  .get(function (req, res) {
    //TODO: Serve the sign up HTML file
  })
  .post(user.signUp);

app.route('/signin')
  .get(function (req, res) {
    //TODO: Serve the sign in HTML file
  })
  .post(user.signIn);
