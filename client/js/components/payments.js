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
            <h1>Payment Settings</h1>
          </div>
            <Paper className="dashboard-subcontent" zDepth={4}>
              <div className="dashboard-subheading">Update Rate</div>
                <div className="dashboard-subheading-content">
                  <TextField ref="newRate" className="new-rate" hintText="$" floatingLabelText={this.getRate()} />
                  <RaisedButton className="new-rate-save" label="Change Rate" secondary={true} onClick={this.changeRate} />
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={4}>
              <div className="dashboard-subheading">Current Balance</div>
                <div className="dashboard-subheading-content">
                  {this.getBalance()}
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={4}>
              <div className="dashboard-subheading">Credit Card Info</div>
                <div className="dashboard-subheading-content">
                </div>
            </Paper>
        </div>
    )
  }
});

module.exports = Settings;
