/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Actions = require('../actions/actions');

var VIP = React.createClass({
  getInitialState: function () {
    return {
      add: [],
      remove: []
    }
  },

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
