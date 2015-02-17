/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var Actions = require('../actions/actions');

var VIP = React.createClass({
  render: function() {
    return (
      <div className="VIP">
        <h1>VIP List</h1>
        <form>
            <TextField
              ref="email" className="login-input" floatingLabelText="Email" />
        </form>
      </div>
    );
  }
});

module.exports = VIP;
