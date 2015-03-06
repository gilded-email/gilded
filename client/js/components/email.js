var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var moment = require('moment');
var dollarString = require('dollar-string');
var mui = require('material-ui');
var Paper = mui.Paper;

var Email = React.createClass({
  mixins: [Router.State],

  getEmailData: function () {
    var emailId = this.getParams().emailId;
    var escrow = this.props.escrow[emailId]; //.userData.escrow[this.getParams().emailId].email);
    var email = JSON.parse(escrow.email);
    email.emailId = emailId;
    email.paid = escrow.paid ? 'Paid' : 'Unpaid';
    email.cost = dollarString.fromCents(escrow.cost);
    email.sentDate = moment(escrow.sentDate).format('lll');
    return email;
  },

  render: function () {

    var email = this.getEmailData();
    return (
      <div className="dashboard">
        <h1>Emails</h1>
        <Paper className="email-page">
          <div className="email-content">
            <div className="back-to-emails">
              <Link to="emails">&lt; Back to Emails</Link>
            </div>

            <hr />

            <h2>{email.subject}</h2>

            <hr />

            <div className="email-metadata">
              <div className="email-top-left">
                <span className="email-from">From: {email.from}</span>
                <br /><span className="email-to">To: {email.to}</span>
              </div>
              <div className="email-top-right">
                <span className="email-sentDate">{email.sentDate}</span>
                <br /><span className="email-paid">Price: {email.cost} ({email.paid})</span>
              </div>
            </div>

            <div className="email-message">
              <span className="email-html" dangerouslySetInnerHTML={{__html: email.html}} />
            </div>

          </div>
        </Paper>
      </div>
    );
  }
});

module.exports = Email;
