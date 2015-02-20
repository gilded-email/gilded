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

  getRate: function() {
    var rate = this.props.settings.rate;
    if (rate) {
      return dollarString.fromCents(rate);
    } else {
      return 0;
    }
  },

  changeRate: function() {
    var newRate = this.refs.newRate.getValue();
    var newRateInCents = dollarString.toCents(newRate);
    this.refs.newRate.setValue('');
    Actions.updateRate(newRateInCents);
  },

  getBalance: function() {
    var balance = this.props.settings.balance;
    return dollarString.fromCents(0);
  },

  render: function() {
    return (
        <div className="dashboard">
          <div className="dashboard-title">
            <h1>Account Settings</h1>
          </div>
          <div className="dashboard-subcontent">
            <div className="dashboard-subheading">Forward Email</div>
              <div className="dashboard-subheading-content">
                <TextField ref="newEmail" className="new-email" floatingLabelText={this.props.settings.forwardEmail} />
                <RaisedButton className="new-email-save" label="Update Email" secondary={true} onClick={this.changeForwardEmail} />
              </div>
          </div>
          <div className="dashboard-subcontent">
            <div className="dashboard-subheading">Password</div>
              <div className="dashboard-subheading-content">
                <TextField ref="newPassword" className="new-password" floatingLabelText="Enter new password" />
                <RaisedButton className="new-password-save" label="Change Password" secondary={true} onClick={this.changePassword} />
              </div>
          </div>
          <div className="dashboard-subcontent">
            <div className="dashboard-subheading">Update Rate</div>
              <div className="dashboard-subheading-content">
                <TextField ref="newRate" className="new-rate" hintText="$" floatingLabelText={this.getRate()} />
                <RaisedButton className="new-rate-save" label="Change Rate" secondary={true} onClick={this.changeRate} />
              </div>
          </div>
          <div className="dashboard-subcontent">
            <div className="dashboard-subheading">Current Balance</div>
              <div className="dashboard-subheading-content">
                {this.getBalance()}
              </div>
          </div>
        </div>
    )
  }
});

module.exports = Settings;
