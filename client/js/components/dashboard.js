/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;
var Router = require('react-router');
var Actions = require('../actions/actions');


var Dashboard = React.createClass({

  mixins: [Router.Navigation, Router.State],

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
      <div>cat
      <LeftNav menuItems={this.menuItems} onChange={this.handleClickEvent} />
      </div>
      )
  }

});

module.exports = Dashboard
