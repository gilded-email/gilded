var mocha = require('mocha');
var assert = require('chai').assert;

describe('Signup Page', function () {
  it('should have username, password, and forwarding input field', function () {
    assert.equal(false, true);
  });

  xit('should make ajax requests to check if current username is taken', function () {
    assert.equal(false, true);
  });

  it('should be able to sign up users', function () {
    assert.equal(false, true);
  });

  it('should not accept empty fields', function () {
    assert.equal(false, true);
  });

  it('should not accept taken usernames', function () {
    assert.equal(false, true);
  });

  it('username input should only accept alphanumeric + "_" + "."', function () {
    assert.equal(false, true);
  });

  it('forward email should be a valid email address', function () {
    assert.equal(false, true);
  });

  it('should make POST request to /signup', function () {
    assert.equal(false, true);
  });

  xit('on successful signup, user is redirected to onboarding page', function () {
    assert.equal(false, true);
  });

});

describe('Login Page', function () {
  it('should have username and password input fields', function () {
    assert.equal(false, true);
  });

  it('should have a login button', function () {
    assert.equal(false, true);
  });

  it('should have a sign up link', function () {
    assert.equal(false, true);
  });

  it('should not submit when input fields are empty', function () {
    assert.equal(false, true);
  });

  it('should make POST request to /login', function () {
    assert.equal(false, true);
  });

  xit('on successful login, redirects to dashboard', function () {
    assert.equal(false, true);
  });

  xit('on unsuccessful login, redirects back to login page', function () {
    assert.equal(false, true);
  });
});

