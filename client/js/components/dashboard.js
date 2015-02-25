var React = require('react');
var cookie = require('cookie');
var Router = require('react-router');
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

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

  getInitialState: function () {
    if (Store.isUserLoggedIn()) {
      Actions.getDashboardInfo();
    }
    return Store.getUserData();
  },
  componentWillMount: function () {
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount: function () {
    Store.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(Store.getUserData());
  },

  handleClickEvent: function (e, key, payload) {
    this.transitionTo(payload.route);
  },

  menuItems: [
    { route: 'emails', text: 'Emails'},
    { route: 'VIP', text: 'VIP List' },
    { route: 'account', text: 'Account Settings' },
    { route: 'payments', text: 'Payment Settings' },
    { route: 'logout', text: 'Log Out'}
  ],

  render: function() {
    var username = cookie.parse(document.cookie).username;
    return (
      <div>

        <div className="dash-menu">
          <h1>Gilded</h1>

          <ul>
          {this.menuItems.map(function (item, key) {
            return (
              <li>
                <Link to={item.route} key={key}>{item.text}</Link>
              </li>
              );
          })}
          </ul>
        </div>

        <div className="dash-content">
          <RouteHandler escrow={this.state.userEmails} settings={this.state.userSettings} vips={this.state.userVIPs} card={this.state.userCard} />
        </div>

        <div className="logged-in-user">
          <span>{username}@gilded.club</span><span className="down-arrow">&#9662;</span>
        </div>

      </div>
      );
  }

});

module.exports = Dashboard;
