/*************************************************************\
*  ██████╗ ██╗██╗     ██████╗ ███████╗██████╗   ╔═══════════╗ *
* ██╔════╝ ██║██║     ██╔══██╗██╔════╝██╔══██╗  ║'.       .'║ *
* ██║  ███╗██║██║     ██║  ██║█████╗  ██║  ██║  ║  '.   .'  ║ *
* ██║   ██║██║██║     ██║  ██║██╔══╝  ██║  ██║  ║  .`'.'`.  ║ *
* ╚██████╔╝██║███████╗██████╔╝███████╗██████╔╝  ║.'       '.║ *
*  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═════╝   ╚═══════════╝ *
\*************************************************************/

$(document).ready(function () {

  console.log('\r\n \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557\r\n\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557  \u2551\'.       .\'\u2551\r\n\u2588\u2588\u2551  \u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551  \u2588\u2588\u2551  \u2551  \'.   .\'  \u2551\r\n\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551  \u2588\u2588\u2551  \u2551  .`\'.\'`.  \u2551\r\n\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D  \u2551.\'       \'.\u2551\r\n \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D   \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D\r\n');

  var React = require('react');

  var Router = require('react-router');
  var Route = Router.Route;
  var RouteHandler = Router.RouteHandler;
  var DefaultRoute = Router.DefaultRoute;

  var Signup = require('./components/signup');
  var Login = require('./components/login');
  var Logout = require('./components/logout');
  var ForgotUsername = require('./components/forgotusername');
  var ForgotPassword = require('./components/forgotpassword');
  var Dashboard = require('./components/dashboard');
  var Account = require('./components/account');
  var Payments = require('./components/payments');
  var Emails = require('./components/emails');
  var Email = require('./components/email');
  var VIP = require('./components/vip');
  var cookie = require('cookie');


  var App = React.createClass({

    render: function () {
      return (
        <RouteHandler />
      );
    }

  });

  var routeToSignupOrLogin = function () {
    var username = cookie.parse(document.cookie).username;
    if (username) {
      return Login;
    } else {
      return Signup;
    }
  };

  var routes = (
    <Route name="root" path="/" handler={App}>
      <DefaultRoute handler={routeToSignupOrLogin()} />
      <Route name="forgotusername" handler={ForgotUsername} />
      <Route name="forgotpassword" handler={ForgotPassword} />
      <Route name="signup" handler={Signup} />
      <Route name="login" handler={Login} />
      <Route name="logout" handler={Logout} />
      <Route name="dashboard" handler={Dashboard}>
        <DefaultRoute handler={Emails} />
        <Route name="emails" handler={Emails} />
        <Route name="email" path="/dashboard/emails/:emailId" handler={Email} />
        <Route name="VIP" handler={VIP} />
        <Route name="account" handler={Account} />
        <Route name="payments" handler={Payments} />
      </Route>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.body);
  });

});
