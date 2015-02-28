/*globals describe,it,xit*/
require('dotenv').load();
var mocha = require('mocha');
var domain = process.env.DOMAIN;
var request = require('request');
var assert = require('chai').assert;
var serverUrl = 'http://localhost:8080';
var cookieParser = require('cookie-parser');
var User = require('../server/user/userModel.js');
var Escrow = require('../server/email/emailModel.js');

describe('User Module', function () {

  User.remove({ username: 'tests' }, function (error) {
    if (error) {
      console.log(error);
    }
  });

  var testUser;
  var j = request.jar();
  it('should be able to sign up users', function (done) {
    request.post({url: serverUrl + '/api/join', json: true, body: {username: 'tests', password: 'secret', forwardEmail: 'gildedtest@dsernst.com'}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        if (httpResponse.statusCode === 409) {
          assert.equal(body.code, 11000);
          done();
        } else {
          assert.equal(httpResponse.statusCode, 201);
          done();
        }
      }
    });
  });

  it('should hash passwords', function (done) {
    User.findOne({username: 'tests'}, function (error, user) {
      if (error) {
        console.log(error);
      }
      testUser = user;
      assert.notEqual(user.password, 'secret');
      done();
    });
  });

  it('should be able to sign in users', function (done) {
    request.post({url: serverUrl + '/api/login', jar: j, json: true, body: {username: 'tests', password: 'secret'}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        done();
      }
    });
  });

  xit('should be able to generate secure sessions per user', function (done) {
    assert.equal(false, true);
  });

  xit('should be able to confirm user session', function (done) {
    assert.equal(false, true);
  });

  it('should be able to add VIPs', function (done) {
    var vipUser = 'testVip@' + domain;
    var url = serverUrl + '/api/user/vipList';
    request.post({url: url, jar: j, json: true, body: {add: [vipUser]}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        assert.include(body.vipList, vipUser);
        done();
      }
    });
  });

  it('should be able to remove VIPs', function (done) {
    var vipUser = 'testVip@' + domain;
    request.put({url: serverUrl + '/api/user/vipList', jar: j, json: true, body: {remove: [vipUser]}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        assert.notInclude(body.vipList, vipUser);
        done();
      }
    });
  });

  it('should allow users to change the forward email address', function (done) {
    request.put({url: serverUrl + '/api/user/settings/email', jar: j, json: true, body: {forwardEmail: 'gildedtestforward@dsernst.com'}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        assert.equal(body.forwardEmail, 'gildedtestforward@dsernst.com');
        done();
      }
    });
  });

  it('should allow users to change their rate', function (done) {
    request.put({url: serverUrl + '/api/user/settings/rate', jar: j, json: true, body: {rate: 300}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        assert.equal(body.rate, 300);
        done();
      }
    });
  });

  it('should allow users to update their password', function (done) {
    request.put({url: serverUrl + '/api/user/settings/password', jar: j, json: true, body: {checkPassword: 'secret', password: 'secret2'}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        done();
      }
    });
  });

  it('should be able to log out users', function (done) {
    request.post({url: serverUrl + '/api/logout', jar: j, json: true, body: {}}, function (error, httpResponse, body) {
      var cookies = j.getCookies(serverUrl);
      assert.equal(cookies.length, 1);
      done();
    });
  });

  xit('should be able to look up forgotten usernames', function () {
    assert.equal(false, true);
  });

  xit('should be able to reset forgotten passwords', function () {
    assert.equal(false, true);
  });

});

describe('Email Module', function () {
  var emailController = require('../server/email/emailController.js');
  var stored;
  var emailData = {
    envelope: JSON.stringify({
      to: ['tests@' + domain]
    }),
    from: 'Tester Guy <gildedtest@dsernst.com>',
    subject: 'Test Email',
    html: '<h1>Testing</h1>',
    text: 'Testing',
    attachments: '0'
  };

  it('should be able to receive emails', function (done) {
    assert.equal(typeof emailController.receive, 'function');
    request.post({url: serverUrl + '/api/inbound', formData: emailData}, function (error, httpResponse, body) {
      if (error) {
        console.log("error posting");
      } else {
        assert.equal(httpResponse.statusCode, 201);
        done();
      }
    });
  });

  xit('addresses should be case insensitive', function () {
    assert.equal(false, true);
  });

  xit("messages from jenkins@' + domain + ' always go through to avoid endless email loops", function () {
    assert.equal(false, true);

  });

  xit('should reply with a payment request email if sender is not on the VIP list', function () {
    assert.equal(false, true);
    // send an email to user@gilded from a non-vip address
      // expect a 'success' response
  });

  it('should be able to send emails', function (done) {
    var testEmail = Object.create(emailData);
    testEmail.to = 'neil.lokare@live.com';
    testEmail.from = 'testsend@' + domain;
    emailController.sendEmail(testEmail, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(result.message, 'success');
        done();
      }
    });
  });

  it('should be able to store emails, with recipients and cost', function (done) {
    User.findOneAndUpdate({username: 'tests'}, {rate: 500}, function (err, user) {
      var recipient = JSON.parse(emailData.envelope).to[0].split('@')[0];
      emailController.store(emailData, null, recipient, function (savedEmail) {
        stored = savedEmail;
        assert.equal(stored.recipient, recipient);
        assert.equal(stored.cost, 500);
        done();
      });
    });
  });


  it('should be able to release emails from escrow', function (done) {
    User.findOne({username: stored.recipient}, function (error, user) {
      emailController.releaseFromEscrow({escrow: stored, params: stored.id, user: user}, {redirect: function (route) {
        assert.equal(route, '/');
        done();
      }});
    });
  });

  it('should return all emails in escrow for a given user', function (done) {
    emailController.fetchEscrows({user: {username: stored.recipient}}, {status: function (code) {
      assert.equal(code, 201);
      return {send: function (data) {
        assert.equal(Array.isArray(data.escrow), true);
        done();
      }};
    }});
  });

  xit('should email back User Does Not Exist message for bad addresses', function () {
    assert.equal(false, true);
  });

  xit('should send a Welcome email when users put their name on the waiting list', function () {
    assert.equal(false, true);
  });

});

describe('Payments Module', function () {
  xit('should be able to receive payments', function () {
    assert.equal(false, true);
  });

  it('should be able to calculate total earnings', function (done) {
    Escrow.find({recipient: 'tests'}, function (error, emails) {
      var total = emails.reduce(function (memo, email) {
        if (email.paid === true) {
          return memo + email.cost;
        }
        return memo;
      }, 0);
      assert.equal(typeof total, 'number');
      done();
    });
  });

  it('should store a current balance per user', function (done) {
    User.findOne({username: 'tests'}, function (error, user) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(typeof user.balance, 'number');
        done();
      }
    });
  });

  xit('should be able to remit payments', function () {
    assert.equal(false, true);
  });

  xit('should charge based on email cost', function () {
    assert.equal(false, true);
    // had an email with cost 500
    // paid for it
    // stripe db showed a $5.00 increase in revenue
  });

  xit('should increment recipient balance based on email cost', function () {
    assert.equal(false, true);
    // paid 500 for an email
    // users balance in db incremented by 500

  });
});

