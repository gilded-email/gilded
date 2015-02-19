/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');


var getInitialState = function() {
  var settings = Store.getUserSettings();
  if (settings) {
    return settings;
  } else {
    return null;
  }
}

var Settings = React.createClass({

  mixins: [StoreWatchMixin(getInitialState)],

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

  changeRate: function() {
    var newRate = this.refs.newRate.getValue();
    this.refs.newRate.setValue('');
    Actions.updateRate(newRate);
  },

  render: function() {
    return (
      <div className="Settings">
        <div className="dashboard">
          <h1>Settings</h1>
          <h2>Change Forwarding Email</h2>
            <span>{this.state.forwardEmail}</span>
            <TextField ref="newEmail" floatingLabelText="New Email"/>
            <RaisedButton label="Save" secondary={true} onClick={this.changeForwardEmail}/>
          <h2>Change Password</h2>
            <span>{this.state.password}</span>
            <TextField ref="newPassword" floatingLabelText="New Password"/>
            <RaisedButton label="Save" secondary={true} onClick={this.changePassword}/>
          <h2>Change Rate</h2>
            <span>{this.state.rate}</span>
            <TextField ref="newRate" floatingLabelText="New Rate" />
            <RaisedButton label="Save" secondary={true} onClick={this.changeRate}/> 
          <h2>Current Balance</h2>
            <div className="balance">
              ${this.state.balance}
            </div>
        </div>
      </div>
    );
  }
});

module.exports = Settings;
