require('dotenv').load();
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var service = require('./server/service/service.js');
var user = require('./server/user/userController.js');
var email = require('./server/email/emailController.js');
var payment = require('./server/payment/paymentController.js');
var marketing = require('./server/marketing/marketingController.js');
var gmailHelpers = require('./server/APIUtils/gmailHelpers.js');
var yahooHelpers = require('./server/APIUtils/yahooHelpers.js');

var app = express();

app.set('httpPort', process.env.PORT || 8080);
app.set('host', process.env.HOST || 'localhost');

http.createServer(app).listen(app.get('httpPort'));
console.log('Server is listening on http://' + app.get('host') + ':' + app.get('httpPort'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.set('views', './views');
app.set('view engine', 'jade');

app.post('/signup', marketing.signup);

app.post('/api/inbound', email.receive, email.verify);
app.post('/api/outbound', user.checkSession, email.compose);
app.get('/api/escrow/', user.checkSession, email.fetchEscrows);
app.post('/api/user/settings/card', user.checkSession, user.addCard, user.update);
app.put('/api/user/settings/rate', user.checkSession, user.changeRate, user.update);
app.put('/api/user/settings/password', user.checkSession, user.checkPassword, user.changePassword, user.update);
app.put('/api/user/settings/email', user.checkSession, user.updateForwardEmail, user.update);

app.post('/api/logout', user.logout);
app.post('/api/user/vipList', user.checkSession, user.addVip, user.update);
app.put('/api/user/vipList', user.checkSession, user.removeVip, user.update);
app.post('/api/join', user.join, user.storeSession, email.welcomeEmail, email.fetchEscrows);
app.post('/api/login', user.login, user.storeSession, email.fetchEscrows);
app.get('/api/user/dashboard', user.checkSession, user.getUser, email.fetchEscrows);
app.post('/api/user/withdraw', user.checkSession, user.withdraw, user.update);
app.post('/api/user/forgotusername', user.normalizeInput, user.forgotUsername);
app.post('/api/user/forgotpassword', user.normalizeInput, user.requestForgotPassword);
app.get('/resetpassword/:resetToken', user.handleForgotPassword);
app.put('/resetpassword/:resetToken', user.resetPassword, user.changePassword, user.update);

app.get('/pay/:id', payment.getDetails, payment.paymentRequest);
app.post('/pay/:id', payment.getDetails, payment.verification, email.findEmailInEscrow, email.findAndPayUserFromEscrow, email.releaseFromEscrow);

app.get('/api/user/getgmailcontacts', gmailHelpers.getAuthCode);
app.get('/oauth2callback/gmail', gmailHelpers.getContacts, user.checkSession, user.addVip, user.addEmailContactsToVipsAndRedirect);

app.post('/contact', service.contact);

app.get('/api/user/getyahoocontacts', yahooHelpers.getRequestToken, yahooHelpers.getUserAuth);
app.get('/oauth2callback/yahoo', yahooHelpers.getAccessToken, yahooHelpers.getContacts, user.checkSession, user.addVip, user.addEmailContactsToVipsAndRedirect);
