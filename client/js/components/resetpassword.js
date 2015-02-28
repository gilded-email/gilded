var React = require('react');
var Router = require('react-router');

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;

var Actions = require('../actions/actions');
var Store = require('../stores/store');

var ResetPassword = React.createClass({
  mixins: [Router.Navigation, Router.State],

  getInitialState: function (){
    return Store.getResetPasswordDetails();
  },

  componentWillMount: function(){
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(this.getInitialState(this));
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.resetPasswordFailure) {
      this.refs.resetPasswordFailure.show();
      setTimeout(function() {
        this.refs.resetPasswordFailure.dismiss();
      }.bind(this), 3000);
      Store.resetForgotPasswordDetails();
    } else if (nextState.resetPasswordSuccess) {
      Store.resetForgotPasswordDetails();
      this.transitionTo('login');
    }
  },


  handleClick: function(e) {
    e.preventDefault();
    var password = this.refs.password.getValue();
    var confirmPassword = this.refs.confirmPassword.getValue();
    var resetToken = window.location.href.split('?')[1];
    if (password !== confirmPassword) {
      this.refs.confirmFailure.show();
      setTimeout(function() {
        this.refs.confirmFailure.dismiss();
      }.bind(this), 3000);
    } else {
      Actions.resetPassword(resetToken, password);
    }
  },

  render: function() {
    return (
      <div className="login-container">
        <Paper className="login">
          <div className="login-content">
            <div className="mui-font-style-display-3">Reset Password</div>
            <form>
              <TextField ref="password" className="login-input" floatingLabelText="Enter new password" />
              <TextField ref="confirmPassword" className="login-input" floatingLabelText="Confirm new password" />
              <RaisedButton className="login-button" onClick={this.handleClick} label="Reset Password" secondary={true} />
            </form>
          </div>
        </Paper>
        <Snackbar ref="confirmFailure" message="Your passwords do not match." />
        <Snackbar ref="resetPasswordFailure" message="An error occurred resetting your password. Please email admin@gilded.club" />
      </div>
    );
  }
});

module.exports = ResetPassword;
