/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');

var Actions = require('../actions/actions');

var getInitialState = function () {
  var currentVIPs = Store.getUserVIPs();
  return {
    currentVIPs: currentVIPs,
    add: [],
    remove: []
  };
};


var VIPremove = React.createClass({
  render: function () {
    return (
      <button onClick={this.handleRemove}>Remove</button>
    );
  }
});

var VIProw = React.createClass({
  render: function () {
    return (
      <tr>
        <td>
          {this.props.email} <VIPremove />
        </td>
      </tr>
    );
  }
});

var VIPtable = React.createClass({
  render: function () {
    return (
      <table>
        {this.props.data.map(function (email) {
          return (
            <VIProw email={email} />
            )
        })}
      </table>
    );
  }
});



var VIP = React.createClass({

  mixins: [StoreWatchMixin(getInitialState)],

  addVipHandler: function (e) {
    e.preventDefault();
    this.state.add.push(this.refs.email.getValue());
    this.refs.email.setValue('');
  },

  updateVipsHandler: function (e) {
    e.preventDefault();
    Actions.updateVips(this.state);
  },

  onChange: function () {

  },

  render: function() {
    return (
      <div className="dashboard">
        <div className="VIP">
          <h1>VIP List</h1>

          <VIPtable data={this.state.currentVIPs} />

            <form>
                <TextField
                  ref="email" className="login-input" floatingLabelText="Add an email address"/>
                <RaisedButton label="Add Contact" secondary={true} onClick={this.addVipHandler}/>
            </form>
            <RaisedButton label="Save" primary={true} onClick={this.updateVipsHandler}/>
            <div>{this.state.currentVIPs}</div>
        </div>
      </div>
    );
  }
});

module.exports = VIP;
