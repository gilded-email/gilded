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
  var Route = Router.Route;
  var Settings = require('./components/settings');
  var History = require('./components/history');
  var VIP = require('./components/vip');
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;
  var DefaultRoute = Router.DefaultRoute;

  var App = React.createClass({

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
      <DefaultRoute handler={Login} />
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

});
