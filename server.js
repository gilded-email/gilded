var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var email = require('./server/email/emailController.js');
var user = require('./server/user/userRouter.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(app.get('port'));
console.log('Server is listening on ' + app.get('host') + ':' + app.get('port'));

app.use('/inbound', email.receive, email.verify); //handle all emails to application domain;

app.post('/signup', function (req, res) {
  // store email in database
  console.log(req.body);
  res.sendStatus(200);
});

app.use('/pay/:id', email.release); //TODO: payments module will handle Stripe transactions and will need to run first
