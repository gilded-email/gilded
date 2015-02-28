var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;
var storeWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');
var validator = require('email-validator');

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
    Actions.removeVIPs([this.props.email]);
  },

  render: function () {
    return (
      <tr>
        <td className="vip-remove-box">
          <button className="vip-remove" onClick={this.removeVIPsHandler}>
          &times;
          </button>
        </td>
        <td className="vip-emails">
          {this.props.email}
        </td>
      </tr>
    );
  }
});

var VIPtable = React.createClass({
  render: function () {
    return (
      <table className="vip-table">
        <tbody>
        {this.props.data.map(function (email, i) {
          return (
            <VIProw email={email} key={i} />
            );
        })}
        </tbody>
      </table>
    );
  }
});

var VIP = React.createClass({

  mixins: [storeWatchMixin(getInitialState)],

  componentWillUpdate: function(nextProps) { //TODO: bug/does not show snackbar with
    if (nextProps.vips.length > this.props.vips.length && this.props.vips[0] !== undefined) {
      this.refs.addEmail.show();
      setTimeout(function() {
        this.refs.addEmail.dismiss();
      }.bind(this), 1000);
    } else if (nextProps.vips.length < this.props.vips.length) {
      this.refs.removeEmail.show();
      setTimeout(function() {
        this.refs.removeEmail.dismiss();
      }.bind(this), 1000);
    }
  },



  addVipHandler: function (e) {
    e.preventDefault();
    var validated = validator.validate(this.refs.email.getValue());
    if (!validated) {
      this.refs.invalidEmail.show();
      setTimeout(function() {
        this.refs.invalidEmail.dismiss();
      }.bind(this), 1000);
    } else if (this.props.vips.indexOf(this.refs.email.getValue()) > -1){
      this.refs.duplicateEmail.show();
      setTimeout(function() {
        this.refs.duplicateEmail.dismiss();
      }.bind(this), 1000);
    } else {
      this.state.add.push(this.refs.email.getValue());
      this.refs.email.setValue('');
      Actions.updateVips(this.state);
    }
  },

  onSubmitVIPHandler: function (e) {
    if (e.keyCode === 13) {
      this.addVipHandler(e);
    }
  },

  render: function() {
    var numberOfVIPsMessage = this.props.vips.length > 0 ? 'You have ' + this.props.vips.length + ' contacts in your VIP list.' : 'Your VIP list is empty.';

    return (
      <div className="dashboard">
        <div className="VIP">
          <h1>VIP List</h1>

          <Paper className="dashboard-subcontent" zDepth={2}>
            <div className="dashboard-subheading">Add VIP</div>
              <div className="dashboard-subheading-content">
                <TextField ref="email" className="login-input" onKeyUp={this.onSubmitVIPHandler} floatingLabelText="Add an email address"/>
                <RaisedButton className="vip-add-button" label="Add VIP" secondary={true} onClick={this.addVipHandler}/>
              </div>
          </Paper>
          <Paper className="vip-table-container" zDepth={2}>
            <div className="dashboard-subheading vip-count">{numberOfVIPsMessage}</div>
            <div className="dashboard-subheading-content">
              <VIPtable data={this.props.vips} />
            </div>
          </Paper>

        </div>
        <Snackbar ref="duplicateEmail" message="VIP contact already exists" />
        <Snackbar ref="invalidEmail" message="Please enter a valid email" />
        <Snackbar ref="addEmail" message="Contact was added to VIP list" />
        <Snackbar ref="removeEmail" message="Contact was removed from VIP list" />
      </div>
    );
  }
});

module.exports = VIP;
