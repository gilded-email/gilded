var React = require('react');
var Router = require('react-router');

var moment = require('moment');
var dollarString = require('dollar-string');
var mui = require('material-ui');
var Menu = mui.Menu;

var Actions = require('../actions/actions');
var Store = require('../stores/store');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');

var Email = React.createClass({
  mixins: [Router.State],

  emailData: function () {
    var emailId = this.getParams().emailId;
    return this.props.escrow[emailId]; //.userData.escrow[this.getParams().emailId].email);

  },

  render: function () {
    console.log(this.props);

    return (
      <div className="email">
        <div className="dashboard">
          <pre>
            {this.emailData()}
          </pre>
        </div>
      </div>
    );
  }
});

module.exports = Email;
