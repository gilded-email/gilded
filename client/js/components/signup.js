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
  			<div className="signup-form">
          <div className="mui-font-style-display-3">Sign Up
          </div>
  				<form>
  					<TextField
  					  className="signup-input" floatingLabelText="Username" />
  					<TextField
  					  className="signup-input" floatingLabelText="Email" />
  					<TextField
  					  className="signup-input" floatingLabelText="Password" />
            <RaisedButton className="signup-button" label="Sign Up" secondary={true} />
            <Link className="login-link" to="login">Already a member? Log in here.</Link>
  				</form>
  			</div>
		)
	}
})

module.exports = Signup;