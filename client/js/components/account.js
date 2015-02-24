/**
 * @jsx React.DOM
 */
var React = require('react');
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var dollarString = require('dollar-string');
var Snackbar = mui.Snackbar;

var getInitialState = function() {
  return null;
};

var Settings = React.createClass({

  mixins: [StoreWatchMixin(getInitialState)],

  getDefaultProps: function() {
      return {
        settings: {
          forwardEmail: "",
          balance: 0,
          rate: 0,
          password: ""
        }
      };
    },

  changeForwardEmail: function() {
    var newForwardEmail = this.refs.newEmail.getValue();
    this.refs.newEmail.setValue('');
    Actions.updateForwardEmail(newForwardEmail);
  },

  changePassword: function() {
    var newPassword = this.refs.newPassword.getValue();
    this.refs.newPassword.setValue('');
    Actions.updatePassword(newPassword);
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextProps !== this.props && this.props.settings.forwardEmail !== undefined) {
      this.refs.snackbar.show();
      setTimeout(function() {
        this.refs.snackbar.dismiss();
      }.bind(this), 1000);
    }
  },


  render: function() {
    return (
        <div className="dashboard">
          <div className="dashboard-title">
            <h1>Account Settings</h1>
          </div>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Forward Email</div>
                <div className="dashboard-subheading-content">
                  <TextField ref="newEmail" className="new-email" floatingLabelText={this.props.settings.forwardEmail} />
                  <RaisedButton className="new-email-save" label="Update Email" secondary={true} onClick={this.changeForwardEmail} />
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Change Password</div>
                <div className="dashboard-subheading-content">
                  <TextField ref="newPassword" className="new-password" type={"password"} floatingLabelText="Enter new password" />
                  <RaisedButton className="new-password-save" label="Change Password" secondary={true} onClick={this.changePassword} />
                </div>
            </Paper>
            <Snackbar ref="snackbar" message="User Settings Saved" />
        </div>
    )
  }
});

module.exports = Settings;
