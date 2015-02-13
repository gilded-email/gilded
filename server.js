var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid')('nlokare', 'Nl110388'); //store credentials as env variables
var email = require('./server/email/email.js');
var user = require('./server/user/userRouter.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(app.get('port'));

app.use('/inbound', email.receive, email.verify); //handle all emails to application domain;

app.post('/signup', function (req, res) {
  // store email in database
  console.log(req.body);
  res.sendStatus(200);
});
