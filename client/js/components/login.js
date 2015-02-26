var React = require('react');

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Snackbar = mui.Snackbar;

var Router = require('react-router');
var Link = Router.Link;

var Actions = require('../actions/actions');
var Store = require('../stores/store');
var cookie = require('cookie');


var Login = React.createClass({

  mixins: [Router.Navigation, Router.State],

  getInitialState: function(){
    if (Store.isUserLoggedIn()) {
      this.transitionTo('dashboard');
    }
    return Store.getUserErrors();
  },

  componentWillMount: function(){
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(this.getInitialState(this));
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextState.login) {
      Store.resetUserErrors();
      this.refs.loginFailure.show();
      setTimeout(function() {
        this.refs.loginFailure.dismiss();
      }.bind(this), 3000);
    }
  },


  handleClick: function (e) {
    e.preventDefault();
    var user = {};
    user.username = this.refs.username.getValue();
    user.password = this.refs.password.getValue();
    Actions.loginUser(user);
  },

  getUsername: function() {
    var username = cookie.parse(document.cookie).username;
    if (username) {
      return username;
    } else {
      return null;
    }
  },

  render: function() {
    return (
      <div className="login-container">
        <Paper className="login">
          <div className="login-content">
            <div className="mui-font-style-display-3">Log In</div>
            <form>
              <TextField ref="username" className="login-input" defaultValue={this.getUsername()} floatingLabelText="Username" />
              <TextField ref="password" type={"password"} className="login-input" floatingLabelText="Password" />
              <RaisedButton onClick={this.handleClick} className="login-button" label="Log In" secondary={true} />
              <Link className="forgotusername-link" to="forgotusername">Forgot Username?</Link><br></br>
              <Link className="signup-link" to="signup">Not a member? Sign up here.</Link>
            </form>
          </div>
        </Paper>
        <Snackbar ref="loginFailure" message="Please enter a valid username and password" />
      </div>
    );
  }
});

module.exports = Login;
