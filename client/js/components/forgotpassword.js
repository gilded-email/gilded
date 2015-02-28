var React = require('react');
var Router = require('react-router');

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;

var Actions = require('../actions/actions');
var Store = require('../stores/store');

var ForgotPassword = React.createClass({
  mixins: [Router.Navigation, Router.State],

  getInitialState: function () {
    return Store.getForgotPasswordDetails();
  },

  componentWillMount: function () {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this.getInitialState(this));
  },

  componentWillUpdate: function (nextProps, nextState) {
    if (nextState.verificationError) {
      this.refs.verificationFailure.show();
      setTimeout(function () {
        this.refs.verificationFailure.dismiss();
      }.bind(this), 3000);
      Store.resetForgotPasswordDetails();
    } else if (nextState.verificationSent) {
      this.refs.verificationSuccess.show();
      setTimeout(function () {
        this.refs.verificationSuccess.dismiss();
      }.bind(this), 3000);
      Store.resetForgotPasswordDetails();
    }
    this.refs.email.setValue('');
  },


  handleClick: function (e) {
    e.preventDefault();
    var username = this.refs.email.getValue();
    Actions.forgotPassword(username);
  },

  render: function () {
    return (
      <div className="login-container">
        <Paper className="login">
          <div className="login-content">
            <div className="mui-font-style-display-3">Forgot Password?</div>
              <form>
                <TextField ref="email" className="login-input" floatingLabelText="Enter your username" />
                <RaisedButton className="login-button" onClick={this.handleClick} label="Send Reset Email" secondary={true} />
              </form>
          </div>
        </Paper>
        <Snackbar ref="verificationFailure" message="There is no account under that username" />
        <Snackbar ref="verificationSuccess" message="A reset password email has been sent to your email address" />
      </div>
    );
  }
});

module.exports = ForgotPassword;
