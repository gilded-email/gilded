var React = require('react');
var Router = require('react-router');
var Actions = require('../actions/actions');

var Logout = React.createClass({
  mixins: [Router.Navigation, Router.State],

  componentDidMount: function () {
    Actions.logout();
  },

  render: function() {
    return (
      <div></div>
    );
  }
});

module.exports = Logout;
