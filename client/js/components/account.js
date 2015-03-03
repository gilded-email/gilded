var React = require('react');
var validator = require('email-validator');

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;

var Actions = require('../actions/actions');
var Store = require('../stores/store.js');
var storeWatchMixin = require('../mixins/StoreWatchMixin');


var getInitialState = function() {
  return Store.getUserChangePassword();
};

var Settings = React.createClass({

  getInitialState: function() {
    return Store.getUserChangePassword();
  },
  componentWillMount: function(){
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    Store.removeChangeListener(this._onChange);
  },
  _onChange: function(){
    this.setState(this.getInitialState());
  },

  changeForwardEmail: function(e) {
    e.preventDefault();
    var newForwardEmail = this.refs.newEmail.getValue();
    if (validator.validate(newForwardEmail)) {
      Actions.updateForwardEmail(newForwardEmail);
    } else {
      this.refs.newEmail.setErrorText('Please enter a valid email');
    }
  },

  changePassword: function(e, oldPassword, newPassword) {
    e.preventDefault();
    this.refs.oldPassword.setValue('');
    this.refs.newPassword.setValue('');
    this.refs.confirmPassword.setValue('');
    Actions.updatePassword(oldPassword, newPassword);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState !== this.state;
  },

  showSnackbar: function() {
    this.refs.newPasswordSnackbar.show()
    setTimeout(function() {
      this.refs.newPasswordSnackbar.dismiss();
      Store.resetUserChangePassword();
    }.bind(this), 500);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.state.text) {
      this.showSnackbar();
    }
    if (prevProps != this.props && prevProps.settings.forwardEmail !== undefined) {
      this.refs.newForwardEmail.show();
      setTimeout(function() {
        this.refs.newForwardEmail.dismiss();
      }.bind(this), 1000);
    }
  },

  getSnackbarText: function () {
    if (this.state && this.state.text) {
      return this.state.text;
    }
    return null;
  },

  onSubmitPasswordHandler: function(e) {
    var oldPassword = this.refs.oldPassword.getValue();
    var newPassword = this.refs.newPassword.getValue();
    var confirmPassword = this.refs.confirmPassword.getValue();
    if (e.keyCode === 13) {
      if (newPassword === confirmPassword) {
        this.changePassword(e, oldPassword, newPassword);
      } else {
        this.refs.confirmPasswordError.show();
        setTimeout(function() {
          this.refs.confirmPasswordError.dismiss();
        }.bind(this), 1000);
      }
    }
  },

  onSubmitEmailHandler: function(e) {
    if (e.keyCode === 13) {
      this.changeForwardEmail(e);
    }
  },

  render: function() {
    return (
        <div className="dashboard">
          <div className="dashboard-title">
            <h1>
              Account Settings
            </h1>
          </div>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Forward Email</div>
                <div className="dashboard-subheading-content">
                  <TextField
                    ref="newEmail"
                    className="new-email"
                    onKeyUp={this.onSubmitEmailHandler}
                    floatingLabelText="Forwarding Email Address"
                    defaultValue={this.props.settings.forwardEmail}
                   />
                  <RaisedButton className="new-email-save" label="Update Email" secondary={true} onClick={this.changeForwardEmail} />
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Change Password</div>
                <div className="dashboard-subheading-content">
                  <TextField ref="oldPassword" className="old-password" type={"password"} onKeyUp={this.onSubmitPasswordHandler} floatingLabelText="Enter old password" /><br></br>
                  <TextField ref="newPassword" className="new-password" type={"password"} onKeyUp={this.onSubmitPasswordHandler} floatingLabelText="Enter new password" /><br></br>
                  <TextField ref="confirmPassword" className="new-password" type={"password"} onKeyUp={this.onSubmitPasswordHandler} floatingLabelText="Confirm new password" /><br></br>
                  <RaisedButton className="new-password-save" label="Change Password" secondary={true} onClick={this.changePassword} />
                </div>
            </Paper>
            <Snackbar ref="newPasswordSnackbar" message={this.state.text} />
            <Snackbar ref="newForwardEmail" message="Your forwarding email has successfully been changed" />
        </div>
    );
  }
});

module.exports = Settings;
