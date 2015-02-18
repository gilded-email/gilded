/**
 * @jsx React.DOM
 */
$(document).ready(function () {

  var React = require('react');
  var Signup = require('./components/signup');
  var Login = require('./components/login');
  var Dashboard = require('./components/dashboard');
  var Router = require('react-router');
  var Route = Router.Route;
  var Settings = require('./components/settings');
  var History = require('./components/history');
  var VIP = require('./components/vip');
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;
  var App = React.createClass({

    render: function () {
      return (
        <div>
          <li><Link to="signup">Sign up</Link></li>
          <li><Link to="login">Login</Link></li>
          <li><Link to="dashboard">Dashboard</Link></li>
          <li><Link to="history">History</Link></li>
            <RouteHandler />
        </div>
      )
    }

  });

  var routes = (
    <Route name="root" path="/" handler={App}>
      <Route name="signup" handler={Signup}/>
      <Route name="login" handler={Login} addHandlerKey={true}/>
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
