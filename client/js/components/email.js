var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var moment = require('moment');
var dollarString = require('dollar-string');
var mui = require('material-ui');
var Paper = mui.Paper;

var Actions = require('../actions/actions');
var Store = require('../stores/store');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');


var getInitialState = function () {
  return null;
};

var Email = React.createClass({
  mixins: [Router.State, StoreWatchMixin(getInitialState)],

  getEmailData: function () {
    console.log(this.props);
    var emailId = this.getParams().emailId;
    var escrow = this.props.escrow[emailId]; //.userData.escrow[this.getParams().emailId].email);
    console.log(this.props);
    var email = JSON.parse(escrow.email);
    email.emailId = emailId;
    email.paid = escrow.paid ? "Paid" : "Unpaid";
    email.cost = dollarString.fromCents(escrow.cost);
    email.sentDate = moment(escrow.sentDate).format('MMM DD');
    console.log(email);
    return email;
  },

  render: function () {

    var email = this.getEmailData();
    return (
        <Paper className="email-page">
          <div className="email-content">
            <div className="back-to-emails">
              <Link to="emails">&lt; Back to Emails</Link>
            </div>
            <h1>{email.subject}</h1>
            <hr />
            <span className="email-from">From: {email.from}</span>
            <br /><span className="email-to">To: {email.to}</span>
            <span className="email-sentDate">{email.sentDate}</span>
            <br /><span className="email-paid">{email.paid} {email.cost}</span>
            <div className="email-message">
              <span className="email-html" dangerouslySetInnerHTML={{__html: email.html}} />
              <span className="email-text">{email.text}</span>
            </div>

          </div>
        </Paper>
    );
  }
});

module.exports = Email;
