require('dotenv').load();
// var fs = require('fs');
var path = require('path');
var http = require('http');
// var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var user = require('./server/user/userController.js');
var email = require('./server/email/emailController.js');
var payment = require('./server/payment/paymentController.js');
var marketing = require('./server/marketing/marketingController.js');

// var privateKey = fs.readFileSync('./key.pem');
// var certificate = fs.readFileSync('./server.crt');
// var credentials = {key: privateKey, cert: certificate};

var app = express();

app.set('httpPort', process.env.PORT || 8080);
// app.set('httpsPort', 3000);
app.set('host', process.env.HOST || 'localhost');

http.createServer(app).listen(app.get('httpPort'));
// https.createServer(credentials, app).listen(app.get('httpsPort'));
console.log('Server is listening on http://' + app.get('host') + ':' + app.get('httpPort')); // + ' and https://' + app.get('host') + ':' + app.get('httpsPort'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.set('views', './views');
app.set('view engine', 'jade');

app.post('/signup', marketing.signup);

app.post('/api/inbound', email.receive, email.verify);
app.get('/api/escrow/', user.checkSession, email.fetchEscrows);
app.post('/api/user/settings/card', user.checkSession, user.addCard, user.update);
app.put('/api/user/settings/rate', user.checkSession, user.changeRate, user.update);
app.put('/api/user/settings/password', user.checkSession, user.changePassword, user.update);
app.put('/api/user/settings/email', user.checkSession, user.updateForwardEmail, user.update);

app.post('/api/logout', user.logout);
app.post('/api/user/vipList', user.checkSession, user.addVip, user.update);
app.put('/api/user/vipList', user.checkSession, user.removeVip, user.update);
app.post('/api/join', user.join, user.storeSession, email.fetchEscrows);
app.post('/api/login', user.login, user.storeSession, email.fetchEscrows);
app.get('/api/user/dashboard', user.checkSession, user.getUser, email.fetchEscrows);
app.post('/api/user/withdraw', user.checkSession, user.withdraw, user.update);
app.post('/api/user/forgotusername', user.normalizeInput, user.forgotUsername);
app.post('/api/user/forgotpassword', user.normalizeInput, user.requestForgotPassword);
app.get('/resetpassword/:urlToken', user.handleForgotPassword);


app.get('/pay/:id', payment.getDetails, payment.paymentRequest);
app.post('/pay/:id', payment.getDetails, payment.verification, email.findEmailInEscrow, email.findAndPayUserFromEscrow, email.releaseFromEscrow);
