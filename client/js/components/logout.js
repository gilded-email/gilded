var React = require('react');
var Router = require('react-router');
var Actions = require('../actions/actions');
var Store = require('../stores/store.js');


var Logout = React.createClass({
  mixins: [Router.Navigation, Router.State],

  getInitialState:function(){
    if (!Store.isUserLoggedIn()) {
      this.transitionTo('login');
    }
    return null;
  },
  componentWillMount:function(){
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount:function(){
    Store.removeChangeListener(this._onChange);
  },
  _onChange:function(){
    this.setState(this.getInitialState(this));
  },

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
