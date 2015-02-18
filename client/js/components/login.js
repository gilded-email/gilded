/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Router = require('react-router');
var MenuItem = mui.MenuItem;
var Link = Router.Link;
var Actions = require('../actions/actions');


var Login = React.createClass({
  mixins: [Router.Navigation, Router.State],

  handleClick: function () {
    var user = {};
    user.username = this.refs.username.getValue();
    user.password = this.refs.password.getValue();
    Actions.loginUser(user);
  },

	render: function() {
		return (
  			<div className="login-form">
          <div className="mui-font-style-display-3">Log In</div>
  				<form>
  					<TextField
  					  ref="username" className="login-input" floatingLabelText="Username" />
  					<TextField
  					  ref="password" className="login-input" floatingLabelText="Password" />
            <RaisedButton onClick={this.handleClick} className="login-button" label="Log In" secondary={true} />
            <Link className="signup-link" to="signup">Not a member? Sign up here.</Link>
  				</form>
  			</div>
		)
	}
})

module.exports = Login;
