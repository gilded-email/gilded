var React = require('react');

var mui = require('material-ui');
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var RouterHandler = Router.RouteHandler;

var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Actions = require('../actions/actions');
var Store = require('../stores/store');


var Authentication = {
  statics: {
    willTransitionTo: function (event) {
      if (!Store.isUserLoggedIn()) {
        event.redirect('login');
      }
    }
  }
};

var Dashboard = React.createClass({

  mixins: [Router.Navigation, Router.State, Authentication],

  getInitialState:function(){
    if (Store.isUserLoggedIn()) {
      Actions.getDashboardInfo();
    }
    return Store.getUserData();
  },
  componentWillMount:function(){
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount:function(){
    Store.removeChangeListener(this._onChange);
  },
  _onChange:function(){
    this.setState(Store.getUserData());
  },


  handleClickEvent: function(e, key, payload) {
    this.transitionTo(payload.route);
  },

  menuItems: [
    { route: 'emails', text: 'Emails'},
    { route: 'VIP', text: 'VIP List' },
    { type: MenuItem.Types.SUBHEADER, text: 'Settings' },
    { route: 'account', text: 'Account' },
    { route: 'payments', text: 'Payments' },
    { route: 'logout', text: 'Log Out'}, 
  ],

  render: function() {
    return (
      <div>
      <div className="dash-menu">
          <LeftNav menuItems={this.menuItems} onChange={this.handleClickEvent} zDepth={4}/>
      </div>
      <div className="dash-content">
        <RouterHandler escrow={this.state.userHistory} settings={this.state.userSettings} vips={this.state.userVIPs} />
      </div>
      </div>
      )
  }

});

module.exports = Dashboard
