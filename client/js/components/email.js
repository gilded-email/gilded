var React = require('react');
var Router = require('react-router');

var moment = require('moment');
var dollarString = require('dollar-string');
var mui = require('material-ui');
var Menu = mui.Menu;

var Actions = require('../actions/actions');
var Store = require('../stores/store');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');

var getInitialState = function() {
  return null;
};

var Email = React.createClass({
  mixins: [Router.State, StoreWatchMixin(getInitialState)],
  render: function () {
    console.log('im running')

    console.log(this.props);
    return (
      <div className="emails">

        <div className="dashboard">

        {this.props.emailId}

        </div>
      </div>
    );
  }
});

module.exports = Email;
