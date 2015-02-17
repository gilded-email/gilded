/*globals describe,it,xit*/
var request = require('request');
var mocha = require('mocha');
var assert = require('chai').assert;
var serverUrl = 'http://gilded.ngrok.com';
require('dotenv').load();
var domain = process.env.DOMAIN;
var User = require('../server/user/userModel.js');
var Escrow = require('../server/email/emailModel.js');

describe('User Module', function () {
  var testUser;
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
    request.post({url: serverUrl + '/api/login', json: true, body: {username: 'tests', password: 'secret'}}, function (error, httpResponse, body) {
      if (error) {
        console.log(error);
      } else {
        assert.equal(httpResponse.statusCode, 201);
        assert.equal(body._id, testUser.id);
        done();
      }
    });
  });

  xit('should be able to generate secure sessions per user', function (done) {

  });

  xit('should be able to confirm user session', function (done) {

  });

  xit('should be able to log out users', function (done) {

  });

  xit('should allow users to update their password', function (done) {

  });

  xit('should allow users to change the forward email address', function (done) {

  });

  xit('should allow users to change their rate', function (done) {

  });

  describe('VIP list', function () {
    var vipUser = 'testVip@' + domain;

    it('should be able to add VIPs', function (done) {
      request.put({url: serverUrl + '/api/user/' + testUser.id + '/vipList', json: true, body: {add: [vipUser], remove: []}}, function (error, httpResponse, body) {
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
      request.put({url: serverUrl + '/api/user/' + testUser.id + '/vipList', json: true, body: {add: [], remove: [vipUser]}}, function (error, httpResponse, body) {
        if (error) {
          console.log(error);
        } else {
          assert.equal(httpResponse.statusCode, 201);
          assert.notInclude(body.vipList, vipUser);
          done();
        }
      });
    });
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
    text: 'Testing'
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
      emailController.store(emailData, recipient, function (savedEmail) {
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
    emailController.fetchEscrows({cookies: {username: stored.recipient}}, {send: function (emails) {
      assert.equal(Array.isArray(emails), true);
      done();
    }});
  });
});

describe('Payments Module', function () {
  it('should be able to receive payments', function () {
    assert.equal(false, true);
  });

  it('should be able to calculate total earnings', function (done) {
    Escrow.find({recipient: 'tests'}, function (err, emails) {
      var total = emails.reduce(function (memo, email) {
        if (email.paid === true) {
          return memo + email.cost;
        }
        return memo;
      });
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

  it('should charge based on email cost', function () {
    assert.equal(false, true);
    // had an email with cost 500
    // paid for it
    // stripe db showed a $5.00 increase in revenue
  });

  it('should increment recipient balance based on email cost', function () {
    assert.equal(false, true);
    // paid 500 for an email
    // users balance in db incremented by 500

  });
});

describe('Settings Module', function () {
  it('should be able to change forwarding email address', function () {
    assert.equal(false, true);
  });

  it('should be able to change password', function () {
    assert.equal(false, true);
  });

  it('should be able to add payment info', function () {
    assert.equal(false, true);
  });

  it('should be able to remove payment info', function () {
    assert.equal(false, true);
  });

  it('should confirm a payment has been received', function () {
    assert.equal(false, true);
  });
});
