var React = require('react');

var Router = require('react-router');
var RaisedButton = require('material-ui').RaisedButton;


var moment = require('moment');
var dollarString = require('dollar-string');
var Snackbar = require('material-ui').Snackbar;

var Actions = require('../actions/actions');
var storeWatchMixin = require('../mixins/StoreWatchMixin');

var getInitialState = function() {
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
            <th>Paid</th>
            <th>Add To VIPs</th>
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
      setTimeout(function() {
        this.refs.duplicateEmail.dismiss();
      }.bind(this), 1000);
    } else {
      Actions.updateVips({
        add: [this.props.from],
        remove: []
      });
      this.refs.addEmail.show();
      setTimeout(function() {
        this.refs.addEmail.dismiss();
      }.bind(this), 1000);
    }
  },

  render: function () {
    return (
        <tr>
          <td onClick={this.viewEmail}>{this.props.from}</td>
          <td onClick={this.viewEmail}>{this.props.subject}</td>
          <td onClick={this.viewEmail}>{this.props.sentDate}</td>
          <td onClick={this.viewEmail}>{this.props.cost}</td>
          <td onClick={this.viewEmail}>{this.props.paid}</td>
          <td><RaisedButton className="vip-add-button" label="Add VIP" secondary={true} onClick={this.addToVIPs}/></td>
          <td className="escrow-snackbar">
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
      <div className="emails">
        <div className="dashboard">
          <h1>Emails</h1>
          <EmailTable vips={this.props.vips} data={this.props.escrow} />
        </div>
      </div>
    );
  }
});

module.exports = Emails;
