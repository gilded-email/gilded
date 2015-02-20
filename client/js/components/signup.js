/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Router = require('react-router');
var Link = Router.Link;
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin.js');

var Signup = React.createClass({
  handleClick: function (e) {
    //get input from refs
    e.preventDefault();
    var user = {};
    user.username = this.refs.username.getValue();
    user.email = this.refs.email.getValue();
    user.password = this.refs.password.getValue();
    Actions.signupUser(user);
  },


	render: function() {
		return (
  			<div className="signup-form">
          <div className="mui-font-style-display-3">
          Sign Up
          </div>
  				<form>
  					<TextField
  					  ref="username" className="signup-input" floatingLabelText="Username" />
  					<TextField
  					  ref="email" className="signup-input" floatingLabelText="Email" />
  					<TextField
  					  ref="password" className="signup-input" floatingLabelText="Password" />

            <RaisedButton onClick={this.handleClick} className="signup-button" label="Join the Club" secondary={true} />

            <Link className="login-link" to="login">Already a member? Log in here.</Link>

  				</form>
  			</div>
		)
	}
})

module.exports = Signup;
