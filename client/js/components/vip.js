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
    }
  }


var VIP = React.createClass({

  mixins: [StoreWatchMixin(getInitialState)],

  _addVipHandler: function (email) {
    this.state.add.push(this.refs.email.getValue());
    this.refs.email.setValue('');
  },

  _updateVipsHandler: function () {
    Actions.updateVips(this.state);
  },

  onChange: function () {

  },

  render: function() {
    return (
      <div className="dashboard">
        <div className="VIP">
          <h1>VIP List</h1>
            <form>
                <TextField
                  ref="email" className="login-input" floatingLabelText="Add an email address"/>
                <RaisedButton label="Add Contact" secondary={true} onClick={this._addVipHandler}/>
            </form>
            <RaisedButton label="Save" primary={true} onClick={this._updateVipsHandler}/>
        </div>
      </div>
    );
  }
});

module.exports = VIP;
