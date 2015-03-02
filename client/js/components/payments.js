var React = require('react');
var Actions = require('../actions/actions');
var storeWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;
var dollarString = require('dollar-string');

var getInitialState = function () {
  return null;
};

var Settings = React.createClass({

  mixins: [storeWatchMixin(getInitialState)],

  getDefaultProps: function () {
    return {
      settings: {
        balance: 0,
        rate: 0
      }
    };
  },

  componentWillUpdate: function (nextProps) {
    var nextCard = nextProps.card;
    if (nextCard.success) {
      Store.resetCard();
      this.refs.cardSuccess.show();
      setTimeout(function () {
        this.refs.cardSuccess.dismiss();
      }.bind(this), 1000);
    } else if (nextCard.failure) {
      Store.resetCard();
      this.refs.cardFailure.show();
      setTimeout(function () {
        this.refs.cardFailure.dismiss();
      }.bind(this), 1000);
    }

  },

  getLast4: function () {
    if (this.props.card.last4) {
      return 'Last Four Digits: ' + this.props.card.last4;
    } else {
      return null;
    }
  },

  changeRate: function (e) {
    e.preventDefault();
    var newRate = this.refs.newRate.getValue();
    var newRateInCents = dollarString.toCents(newRate);
    this.refs.newRate.setValue('');
    Actions.updateRate(newRateInCents);
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

  onSubmitRateHandler: function (e) {
    if (e.keyCode === 13) {
      this.changeRate(e);
    }
  },


// Withdraw

  getBalance: function () {
    if (this.props.settings.balance <= 0) {
      this.emptyBalance = true;
    } else {
      this.emptyBalance = false;
    }
    if (this.props.settings.balance) {
      return dollarString.fromCents(this.props.settings.balance);
    } else {
      return dollarString.fromCents(0);
    }
  },

  withdraw: function () {
    this.refs.dialog.show();
  },

//Dialog Actions

  onWithdrawalConfirmation: function () {
    Actions.withdraw();
    this.refs.dialog.dismiss();
  },


  render: function () {
    // Disable withdraw if empty balance or no card added
    var withdrawDisabled = this.emptyBalance || this.getLast4() === null;
    var withdrawMessage = this.getLast4() === null ? "You need to add a debit card before you can withdraw." : null;

    return (

      <div className="dashboard">

        <div className="dashboard-title">
          <h1>Payment Settings</h1>
        </div>

        <Paper className="dashboard-subcontent" zDepth={2}>
          <div className="dashboard-subheading">Update Rate</div>
          <div className="dashboard-subheading-content">
            <div className="rate-calculation">
              <p className="rate-current-rate">Your current rate is: {dollarString.fromCents(this.props.settings.rate)}.</p>
              <p className="rate-you-receive">Senders will be charged {dollarString.fromCents(Math.ceil(this.props.settings.rate * 1.029) + 30)} per email, and you'll receive {dollarString.fromCents(this.props.settings.rate * 0.7)} per email.</p>
            </div>
            <TextField ref="newRate" className="new-rate" hintText="$" onKeyUp={this.onSubmitRateHandler} floatingLabelText={dollarString.fromCents(this.props.settings.rate)} />
            <RaisedButton className="new-rate-save" label="Change Rate" secondary={true} onClick={this.changeRate} />
          </div>
        </Paper>

        <Paper className="dashboard-subcontent" zDepth={2}>
          <div className="dashboard-subheading withdraw">Current Balance</div>
          <div className="dashboard-subheading-content withdraw-balance">
            <span className="withdraw-message">{withdrawMessage}</span>
            <span className="balance-amount">{this.getBalance()}</span>
            <div className="withdraw-button">
              <RaisedButton label="Withdraw" onClick={this.withdraw} disabled={withdrawDisabled} secondary={!withdrawDisabled} />
            </div>
          </div>
        </Paper>

        <Paper className="dashboard-subcontent" zDepth={2}>
          <div className="dashboard-subheading">Debit Card Info</div>
          <div className="dashboard-subheading-content">
            <div className="payment-card-info">{this.getLast4()}</div>
              <TextField ref="cardHolderName" className="cardholdername-input" hintText="John Doe" floatingLabelText="Card Holder Name" />
              <TextField ref="cardNumber" className="cardnumber-input" hintText="4242424242424242" floatingLabelText="Card Number" />
              <TextField ref="expMonth" className="expmonth-input" hintText="3" floatingLabelText="Expiration Month" />
              <TextField ref="expYear" className="expyear-input" hintText="17" floatingLabelText="Expiration Year" />
              <TextField ref="cvc" className="cvc-input" hintText="323" floatingLabelText="CVC" />
              <RaisedButton className="card-add" label="Add Card" secondary={true} onClick={this.addCard} />
            </div>
        </Paper>

        <Dialog ref="dialog" title="Withdrawal Confirmation" actions={[{ text: 'Cancel' }, <RaisedButton secondary={true} label="Confirm Withdrawal" onClick={this.onWithdrawalConfirmation} />]}>
          Our payment processor charges $0.25 per successful transfer, which will be deducted from your balance. Please confirm that you wish to make a transfer now.
        </Dialog>
        <Snackbar ref="cardSuccess" message="Card successfully added!" />
        <Snackbar ref="cardFailure" message="Card failed to save." />
        <Snackbar ref="cardFailure" message="Card failed to save." />

      </div>

    );

  }
});

module.exports = Settings;
