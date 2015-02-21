var React = require('react');

var Router = require('react-router');
var Link = Router.link;

var mui = require('material-ui');
var Menu = mui.Menu;

var moment = require('moment');
var dollarString = require('dollar-string');

var Actions = require('../actions/actions');
var Store = require('../stores/store');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');

var getInitialState = function() {
  var data = Store.getUserEmails();
  return {
    escrow: data
  };
};

var Escrows = React.createClass({
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
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(function (escrow, i) {
            var email = JSON.parse(escrow.email);
            email.index = i + 1;
            email.paid = escrow.paid ? "Paid" : "Unpaid";
            email.cost = dollarString.fromCents(escrow.cost);
            email.sentDate = moment(escrow.sentDate).format('MMM DD');
            return (
              <Email {...email} key={i} />
              )
          })}
        </tbody>
      </table>
      )
  }
});

var Email = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.from}</td>
        <td>{this.props.subject}</td>
        <td>{this.props.sentDate}</td>
        <td>{this.props.cost}</td>
        <td>{this.props.paid}</td>
      </tr>
      )
  }
});

var Emails = React.createClass({
  mixins: [StoreWatchMixin(getInitialState)],

  render: function () {

    return (
      <div className="emails">

        <div className="dashboard">
          <h1>Emails</h1>

          <Escrows data={this.props.escrow} />

        </div>
      </div>
    );
  }
});

module.exports = Emails;
