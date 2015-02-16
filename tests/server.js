/*globals describe,it,xit*/
var request = require('request');
var mocha = require('mocha');
var assert = require('chai').assert;
var serverUrl = 'http://gilded.ngrok.com';
require('dotenv').load();
var domain = process.env.DOMAIN;

var emailData = {
  envelope: JSON.stringify({
    to: ['tests@' + domain]
  }),
  from: 'Tester Guy <testvip@' + domain + '>',
  subject: 'Test Email',
  html: '<h1>Testing</h1>',
  text: 'Testing'
};

describe('User Module', function () {
  xit('should be able to sign up users', function () {
    assert.equal(false, true);
  });

  xit('should hash passwords', function () {
    assert.equal(false, true);
  });

  xit('should be able to sign in users', function () {
    assert.equal(false, true);
  });

  xit('should be able to add VIPs', function () {
    assert.equal(false, true);
  });

  xit('should be able to check VIP List', function () {
    assert.equal(false, true);
  });
});

describe('Email Module', function () {
  var emailController = require('../server/email/emailController.js');
  it('should be able to receive emails', function (done) {
    assert.equal(typeof emailController.receive, 'function');
    request.post({url: serverUrl + '/inbound', formData: emailData}, function (error, httpResponse, body) {
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
    var testEmail = emailData;
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

  it('should be able to store and retrieve emails, with recipient', function (done) {
    var recipient = emailData.to.split('@')[0];
    emailController.store(emailData, recipient, function (savedEmail) {
      var stored = savedEmail;
      assert.equal(stored.recipient, recipient);

      emailController.release({params: {id: stored._id}}, {send: function () {}, redirect: function () {}},
        function (error, result) {
          if (!error) {
            done();
          }
        });
    });
  });

  it('should store emails with a cost matching the user\'s set rate', function () {
    assert.equal(false, true);
    // we created a user with a rate of 500
    // then sent an email to that user
    // and ensured it was stored in the escrow table with a cost of 500
  });

  it('should be able to remove emails from escrow', function () {
    assert.equal(false, true);
  });
});

describe('Payments Module', function () {
  it('should be able to receive payments', function () {
    assert.equal(false, true);
  });

  it('should be able to calculate total earnings', function () {
    assert.equal(false, true);
  });

  it('should be able to calculate current balance', function () {
    assert.equal(false, true);
  });

  it('should be able to remit payments', function () {
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
