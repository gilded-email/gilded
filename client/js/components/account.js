var React = require('react');
var validator = require("email-validator");

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;

var Actions = require('../actions/actions');
var storeWatchMixin = require('../mixins/StoreWatchMixin');


var getInitialState = function() {
  return null;
};

var Settings = React.createClass({

  mixins: [storeWatchMixin(getInitialState)],

  getDefaultProps: function() {
      return {
        settings: {
          forwardEmail: '',
          password: ''
        }
      };
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

  changePassword: function(e) {
    e.preventDefault();
    var newPassword = this.refs.newPassword.getValue();
    this.refs.newPassword.setValue('');
    Actions.updatePassword(newPassword);
  },

  componentWillUpdate: function(nextProps) {
    if (nextProps !== this.props && this.props.settings.forwardEmail !== undefined) {
      this.refs.snackbar.show();
      setTimeout(function() {
        this.refs.snackbar.dismiss();
      }.bind(this), 1000);
    }
  },

  onSubmitPasswordHandler: function(e) {
    if (e.keyCode === 13) {
      this.changePassword(e);
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
                  <TextField ref="newPassword" className="new-password" type={"password"} onKeyUp={this.onSubmitPasswordHandler} floatingLabelText="Enter new password" />
                  <RaisedButton className="new-password-save" label="Change Password" secondary={true} onClick={this.changePassword} />
                </div>
            </Paper>
            <Snackbar ref="snackbar" message="User Settings Saved" />
        </div>
    );
  }
});

module.exports = Settings;
