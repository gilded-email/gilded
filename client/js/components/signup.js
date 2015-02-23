/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Router = require('react-router');
var Link = Router.Link;
var Actions = require('../actions/actions');
var Store = require('../stores/store.js');
var StoreWatchMixin = require('../mixins/StoreWatchMixin.js');

var Signup = React.createClass({

  mixins: [Router.Navigation, Router.State],

  getInitialState:function(){
    if (Store.isUserLoggedIn()) {
      this.transitionTo('dashboard');
    }
    return null;
  },
  componentWillMount:function(){
    Store.addChangeListener(this._onChange);
  },
  componentWillUnmount:function(){
    Store.removeChangeListener(this._onChange);
  },
  _onChange:function(){
    this.setState(this.getInitialState(this));
  },

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
      <div className="signup-container">
        <Paper zDepth={4} className="signup">
          <div className="signup-content">
            <div className="mui-font-style-display-3">Sign Up</div>
            <form>
              <TextField ref="username" className="signup-input" floatingLabelText="Username" />
              <TextField ref="email" className="signup-input" floatingLabelText="Email" />
              <TextField ref="password" type={"password"} className="signup-input" floatingLabelText="Password" />
              <RaisedButton onClick={this.handleClick} className="signup-button" label="Join the Club" secondary={true} />

              <Link className="login-link" to="login">Already a member? Log in here.</Link>
            </form>
          </div>
        </Paper>
      </div>
    )
  }
})

module.exports = Signup;
