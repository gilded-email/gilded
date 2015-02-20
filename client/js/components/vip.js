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

var VIProw = React.createClass({
  removeVIPsHandler: function () {
    contactToRemove = this.props.email.toString();
    Actions.removeVIPs([this.props.email]);
  },

  render: function () {
    return (
      <tr>
        <td>
          <button onClick={this.removeVIPsHandler}>Remove</button>
        </td>
        <td>
          {this.props.email}
        </td>
      </tr>
    );
  }
});

var VIPtable = React.createClass({
  render: function () {
    return (
      <table>
        <tbody>
        {this.props.data.map(function (email) {
          return (
            <VIProw email={email} />
            )
        })}
        </tbody>
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
    Actions.updateVips(this.state);
  },

  render: function() {
    console.log(this.state)
    var numberOfVIPsMessage = this.state.currentVIPs.length > 0 ? "You have " + this.state.currentVIPs.length + " VIPs in your list." : "Your VIP list is empty."

    return (
      <div className="dashboard">
        <div className="VIP">
          <h1>VIP List</h1>

          {numberOfVIPsMessage}

          <VIPtable data={this.state.currentVIPs} />

          <form>
            <TextField
              ref="email" className="login-input" floatingLabelText="Add an email address"/>
            <RaisedButton label="Add Contact" secondary={true} onClick={this.addVipHandler}/>
          </form>

        </div>
      </div>
    );
  }
});

module.exports = VIP;
