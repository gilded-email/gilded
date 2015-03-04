var React = require('react');

var Router = require('react-router');

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var Snackbar = mui.Snackbar;
var Paper = mui.Paper;

var moment = require('moment');
var dollarString = require('dollar-string');

var Actions = require('../actions/actions');
var storeWatchMixin = require('../mixins/StoreWatchMixin');

var getInitialState = function () {
  return null;
};

var EmailTable = React.createClass({
  emailData: function () {
    var dataForEmails = {
      vips: this.props.vips
    };

    if (!this.props.data.map) {
      dataForEmails.emails = [];
    } else {
      dataForEmails.emails = this.props.data
        .map(function (escrow, i) {
          var email = JSON.parse(escrow.email);
          email.emailId = i;
          email.paid = escrow.paid ? 'Paid' : 'Unpaid';
          email.cost = dollarString.fromCents(escrow.cost);
          email.sentDate = moment(escrow.sentDate).format('MMM D');
          email.sentTime = escrow.sentDate;
          email.vips = dataForEmails.vips;
          return email;
        }).sort(function (a, b) {
          // Sort emails by newest first
          return new Date(b.sentTime) - new Date(a.sentTime);
        });
    }

    return dataForEmails;
  },

  render: function () {
    return (
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.emailData().emails.map(function (email, i) {
          return (
            <EmailRow {...email} key={i} />
          );
        }
      )}
        </tbody>
      </table>
      );
  }
});

var EmailRow = React.createClass({
  mixins: [Router.Navigation],

  viewEmail: function () {
    this.transitionTo('email', {emailId: this.props.emailId});
  },

  addToVIPs: function (e) {
    e.preventDefault();
    if (this.props.vips.indexOf(this.props.from) > -1){
      this.refs.duplicateEmail.show();
      setTimeout(function () {
        this.refs.duplicateEmail.dismiss();
      }.bind(this), 1000);
    } else {
      Actions.updateVips({
        add: [this.props.from],
        remove: []
      });
      this.refs.addEmail.show();
      setTimeout(function () {
        this.refs.addEmail.dismiss();
      }.bind(this), 1000);
    }
  },

  render: function () {
    return (
        <tr>
          <td onClick={this.viewEmail} className="email-from">{this.props.from}</td>
          <td onClick={this.viewEmail} className="email-subject">{this.props.subject}</td>
          <td onClick={this.viewEmail} className="email-sentDate">{this.props.sentDate}</td>
          <td onClick={this.viewEmail} className="email-cost">{this.props.cost}</td>
          <td onClick={this.viewEmail} className="email-paid">{this.props.paid}</td>
          <td className="email-addVip"><RaisedButton className="vip-add-button" label="Add VIP" secondary={true} onClick={this.addToVIPs}/></td>
          <td>
            <Snackbar ref="duplicateEmail" message="VIP contact already exists" />
            <Snackbar ref="addEmail" message="Contact was added to VIP list" />
          </td>
        </tr>
      );
  }
});

var Emails = React.createClass({
  mixins: [storeWatchMixin(getInitialState)],

  render: function () {
    return (
      <div className="dashboard email">
        <h1>Emails</h1>
        <Paper>
        <div className="emails-table">
          <EmailTable vips={this.props.vips} data={this.props.escrow} />
          </div>
        </Paper>
      </div>
    );
  }
});

module.exports = Emails;
