/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Actions = require('../actions/actions');
var RouterHandler = Router.RouteHandler;
var Store = require('../stores/store');

var getInitialState = function(){
  if (Store.isUserLoggedIn) {
    console.log('dashboard got triggered')
    return null;
  }
};

// var userAuthentication = {
//   userCheck
// };

var Dashboard = React.createClass({

  mixins: [Router.Navigation, Router.State, StoreWatchMixin(getInitialState)],

  handleClickEvent: function(e, key, payload) {
    this.transitionTo(payload.route);
  },

  menuItems: [
    { route: 'history', text: 'History'},
    { route: 'settings', text: 'Settings' },
    { route: 'VIP', text: 'VIP List' },
    { type: MenuItem.Types.SUBHEADER, text: '' },
    { route: 'logout', text: 'Log Out'}
  ],

  render: function() {
    return (
      <div>
      <LeftNav menuItems={this.menuItems} onChange={this.handleClickEvent} />
        <RouterHandler />
      </div>
      )
  }

});

module.exports = Dashboard
