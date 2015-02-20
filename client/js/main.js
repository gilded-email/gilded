/**
 * @jsx React.DOM
 */
$(document).ready(function () {

  var React = require('react');
  var Signup = require('./components/signup');
  var Login = require('./components/login');
  var Logout = require('./components/logout');
  var Dashboard = require('./components/dashboard');
  var Router = require('react-router');
  var Store = require('./stores/store.js');
  var Route = Router.Route;
  var Settings = require('./components/settings');
  var History = require('./components/history');
  var VIP = require('./components/vip');
  var Actions = require('./actions/actions');
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;
  var DefaultRoute = Router.DefaultRoute;

  var App = React.createClass({

    getInitialState:function(){
      if (Store.isUserLoggedIn()) {
        Actions.getDashboardInfo();
      }
      console.log('this is in main and is userdata', Store.getUserData());
      return Store.getUserData();
    },
    componentWillMount:function(){
      Store.addChangeListener(this._onChange)
    },
    componentWillUnmount:function(){
      Store.removeChangeListener(this._onChange)
    },
    _onChange:function(){
      console.log('on change userdata', Store.getUserData());
      this.setState(Store.getUserData());
    },

    render: function () {
      return (
        <div>
          <li><Link to="signup">Sign up</Link></li>
          <li><Link to="login">Login</Link></li>
          <li><Link to="dashboard">Dashboard</Link></li>
            <RouteHandler />
        </div>
      )
    }

  });

  var routes = (
    <Route name="root" path="/" handler={App}>
      <Route name="signup" handler={Signup}/>
      <Route name="login" handler={Login} />
      <Route name="logout" handler={Logout} />
      <Route name="dashboard" handler={Dashboard}>
        <Route name="history" handler={History}/>
        <Route name="settings" handler={Settings}/>
        <Route name="VIP" handler={VIP}/>
      </Route>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

});
