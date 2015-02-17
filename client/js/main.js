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
  var History = require('./components/history');
  var RouteHandler = Router.RouteHandler;
  var Link = Router.Link;
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
    <Route handler={App}>
      <Route name="signup" handler={Signup}/>
      <Route name="login" handler={Login}/>
      <Route name="dashboard" handler={Dashboard}>
        <Route name="history" handler={History}/>
      </Route>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

});
