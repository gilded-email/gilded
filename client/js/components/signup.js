/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;


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
            <a href="#" className="login-link">Already a member? Log in here.</a>
  				</form>
  			</div>
		)
	}
})

module.exports = Signup;