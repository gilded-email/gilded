// require('dotenv').load();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var email = require('./server/email/emailController.js');
var user = require('./server/user/userRouter.js');
var marketing = require('./server/marketing/marketingController.js');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '127.0.0.1');

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(app.get('port'));
console.log('Server is listening on ' + app.get('host') + ':' + app.get('port'));

app.use('/inbound', email.receive, email.verify); // handle all emails to application domain;
app.use('/pay/:id', email.findEmailInEscrow, email.findUserFromEscrow, email.releaseFromEscrow); // TODO: payments module will handle Stripe transactions and will need to run first

app.post('/signup', function (req, res) {
  marketing.addSignup(req, res);
});
