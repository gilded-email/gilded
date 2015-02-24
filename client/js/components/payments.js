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
var Snackbar = mui.Snackbar;
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

  componentWillUpdate: function(nextProps, nextState) {
    var nextCard = nextProps.card;
    if (nextCard.success) {
      Store.resetCard();
      this.refs.cardSuccess.show();
      setTimeout(function() {
        this.refs.cardSuccess.dismiss();
      }.bind(this), 1000);
    } else if (nextCard.failure) {
      Store.resetCard();
      this.refs.cardFailure.show();
      setTimeout(function() {
        this.refs.cardFailure.dismiss();
      }.bind(this), 1000);
    }

  },

  getLast4: function() {
    if (this.props.card.last4) {
      return 'XXXX-XXXX-XXXX-' +this.props.card.last4;
    } else {
      return null;
    }
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
    return dollarString.fromCents(balance);
  },

  addCard: function () {
    var card = {
      cardNumber: this.refs.cardNumber.getValue(),
      expMonth: this.refs.expMonth.getValue(),
      expYear: this.refs.expYear.getValue(),
      cvc: this.refs.cvc.getValue(),
      cardHolderName: this.refs.cardHolderName.getValue()
    };
    this.refs.cardNumber.setValue('');
    this.refs.expMonth.setValue('');
    this.refs.expYear.setValue('');
    this.refs.cvc.setValue('');
    this.refs.cardHolderName.setValue('');
    Actions.addCard(card);
  },

  render: function() {
    return (
        <div className="dashboard">
          <div className="dashboard-title">
            <h1>Payment Settings</h1>
          </div>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Update Rate</div>
                <div className="dashboard-subheading-content">
                  <TextField ref="newRate" className="new-rate" hintText="$" floatingLabelText={this.getRate()} />
                  <RaisedButton className="new-rate-save" label="Change Rate" secondary={true} onClick={this.changeRate} />
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Current Balance</div>
                <div className="dashboard-subheading-content">
                  {this.getBalance()}
                </div>
            </Paper>
            <Paper className="dashboard-subcontent" zDepth={2}>
              <div className="dashboard-subheading">Credit Card Info</div>
                <div className="dashboard-subheading-content">
                <div className="payment-card-info">{this.getLast4()}</div>
                  <TextField ref="cardHolderName" className="cardholdername-input" hintText="John Doe" floatingLabelText="Card Holder Name" />
                  <TextField ref="cardNumber" className="cardnumber-input" hintText="xxxx xxxx xxxx 4242" floatingLabelText="Card Number" />
                  <TextField ref="expMonth" className="expmonth-input" hintText="3" floatingLabelText="Expiration Month" />
                  <TextField ref="expYear" className="expyear-input" hintText="17" floatingLabelText="Expiration Year" />
                  <TextField ref="cvc" className="cvc-input" hintText="323" floatingLabelText="CVC" />
                  <RaisedButton className="card-add" label="Add Card" secondary={true} onClick={this.addCard} />
                </div>
            </Paper>
          <Snackbar ref="cardSuccess" message="Card successfully added!" />
          <Snackbar ref="cardFailure" message="Card failed to save." />

        </div>
    )
  }
});

module.exports = Settings;
