/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Router = require('react-router');
var Link = Router.Link;


var Signup = React.createClass({
	render: function() {
		return (
  			<div className="login-form">
          <div className="mui-font-style-display-3">Log In</div>
  				<form>
  					<TextField
  					  className="login-input" floatingLabelText="Username" />
  					<TextField
  					  className="login-input" floatingLabelText="Password" />
            <RaisedButton className="login-button" label="Log In" secondary={true} />
            <Link className="signup-link" to="signup">Not a member? Sign up here.</Link>
  				</form>
  			</div>
		)
	}
})

module.exports = Signup;