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


/**
[
  {"_id":"54e67b9b65379647526ddc60","email":"{\"to\":[\"tests@g.mtm.gs\"],\"from\":\"gildedtest@dsernst.com\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":100,"paid":false,"sentDate":"2015-02-20T00:11:07.123Z"},
  {"_id":"54e67b9be60a837653ab668f","email":"{\"envelope\":\"{\\\"to\\\":[\\\"tests@g.mtm.gs\\\"]}\",\"from\":\"Tester Guy <gildedtest@dsernst.com>\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":500,"paid":false,"sentDate":"2015-02-20T00:11:07.359Z"}
]
**/

var fakeData = [
  {"_id":"54e67b9b65379647526ddc60","email":"{\"to\":[\"tests@g.mtm.gs\"],\"from\":\"gildedtest@dsernst.com\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":100,"paid":false,"sentDate":"2015-02-20T00:11:07.123Z"},
  {"_id":"54e67b9be60a837653ab668f","email":"{\"envelope\":\"{\\\"to\\\":[\\\"tests@g.mtm.gs\\\"]}\",\"from\":\"Tester Guy <gildedtest@dsernst.com>\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":500,"paid":false,"sentDate":"2015-02-20T00:11:07.359Z"}
]

var getInitialState = function() {
  // var data = [];
  // data = Store.getUserEmails();
  return {
    escrow: fakeData
  };
};

var Escrows = React.createClass({
  emailData: function () {
      if(!this.props.data.map) return [];
      else return this.props.data;
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
          </tr>
        </thead>
        <tbody>
          { this.emailData().map(function (escrow, i) {
          var email = JSON.parse(escrow.email);
          email.emailId = i;
          email.paid = escrow.paid ? "Paid" : "Unpaid";
          email.cost = dollarString.fromCents(escrow.cost);
          email.sentDate = moment(escrow.sentDate).format('MMM DD');
          return (
            <Email {...email} key={i} />
          )
        }
      )}
        </tbody>
      </table>
      )
  }
});

var Email = React.createClass({
  mixins: [Router.Navigation],
  viewEmail: function () {
    this.transitionTo('email', {emailId: this.props.emailId});
  },
  render: function () {
    return (
      <tr onClick={this.viewEmail}>
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

          <Escrows data={fakeData} />

        </div>
      </div>
    );
  }
});

module.exports = Emails;
