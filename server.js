require('dotenv').load();
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var user = require('./server/user/userRouter.js');
var email = require('./server/email/emailController.js');
var payment = require('./server/payment/paymentController.js');
var marketing = require('./server/marketing/marketingController.js');

var privateKey = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./server.crt');
var credentials = {key: privateKey, cert: certificate};

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '127.0.0.1');

http.createServer(app).listen(8080);
https.createServer(credentials, app).listen(app.get('port'));

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log('Server is listening on ' + app.get('host') + ':' + app.get('port'));

app.use('/inbound', email.receive, email.verify); // handle all emails to application domain;
app.use('/release/:id', email.findEmailInEscrow, email.findUserFromEscrow, email.releaseFromEscrow);

app.post('/signup', function (req, res) {
  marketing.addSignup(req, res);
});

app.get('/pay/:id', function (req, res) {
  res.sendFile(path.join(__dirname, './client/payment.html'));
});

app.post('/pay/:id', payment.verification);
