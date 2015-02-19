require('dotenv').load();
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var user = require('./server/user/userController.js');
var email = require('./server/email/emailController.js');
var payment = require('./server/payment/paymentController.js');
var marketing = require('./server/marketing/marketingController.js');

var privateKey = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./server.crt');
var credentials = {key: privateKey, cert: certificate};

var app = express();

app.set('httpPort', 8080);
app.set('httpsPort', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'localhost');

http.createServer(app).listen(app.get('httpPort'));
https.createServer(credentials, app).listen(app.get('httpsPort'));
console.log('Server is listening on http://' + app.get('host') + ':' + app.get('httpPort') + ' and https://' + app.get('host') + ':' + app.get('httpsPort'));

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/inbound', email.receive, email.verify);
app.use('/api/escrow/', user.checkSession, email.fetchEscrows);
app.use('/api/user/settings', user.checkSession, user.changePassword, user.updateForwardEmail, user.changeRate);

app.post('/signup', function (req, res) {
  marketing.addSignup(req, res);
});

app.post('/api/join', user.join, user.storeSession, email.fetchEscrows);
app.post('/api/login', user.login, user.storeSession, email.fetchEscrows);
app.post('/api/logout', user.logout);
app.put('/api/user/vipList', user.checkSession, user.editVip);

app.get('/pay/:id', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/payment.html'));
});

app.post('/pay/:id', payment.getDetails, payment.verification, email.findEmailInEscrow, email.findAndPayUserFromEscrow, email.releaseFromEscrow);
