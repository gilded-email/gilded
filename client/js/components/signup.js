var React = require('react');

var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var Paper = mui.Paper;
var Router = require('react-router');
var Link = Router.Link;
var Actions = require('../actions/actions');
var Store = require('../stores/store.js');
var Snackbar = mui.Snackbar;


var Signup = React.createClass({

  mixins: [Router.Navigation, Router.State],

  getInitialState: function(){
    if (Store.isUserLoggedIn()) {
      this.transitionTo('dashboard');
    }
    return Store.getUserErrors();
  },

  componentWillMount: function () {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    Store.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState(this.getInitialState(this));
  },

  componentWillUpdate: function (nextProps, nextState) {
    // Show errors if any
    if (nextState.signupError) {
      this.showError(nextState.signupError);
      Store.resetUserErrors();
    }
  },

  // Show Error with a snackbar notification
  showError: function (errorMessage) {
    errorMessage = errorMessage || '';
    this.setState({'errorMessage': errorMessage});
    this.refs.signupFailure.show();
    // setTimeout(function() {
    //   this.refs.signupFailure.dismiss();
    // }.bind(this), 3000);
  },

  handleClick: function (e) {
    e.preventDefault();

    // Get input from refs
    var user = {};
    user.username = this.refs.username.getValue();
    user.email = this.refs.email.getValue();
    user.password = this.refs.password.getValue();

    if (user.username === '' || user.password === '') {
      this.showError('Username and password required');
    }

    else {
      Actions.signupUser(user);
    }

  },


  render: function() {
    console.log(this.refs.username);
    return (
      <div className="signup-container">
        <Paper zDepth={4} className="signup">
          <div className="signup-content">
            <div className="mui-font-style-display-3">Sign Up</div>
            <form>
              <TextField ref="email" className="signup-input" floatingLabelText="Current email address" />
              <div className="username-container">
                <TextField ref="username" className="signup-input" floatingLabelText="Choose your username" />
                <span className="username-at-gilded">@gilded.club</span>
              </div>
              <TextField ref="password" type={"password"} className="signup-input" floatingLabelText="Create a password" />

              <RaisedButton onClick={this.handleClick} className="signup-button" label="Join the Club" secondary={true} />

              <Link className="login-link" to="login">Already a member? Log in here.</Link>
            </form>
          </div>
        </Paper>
        <Snackbar ref="signupFailure" message={this.state.errorMessage} />
      </div>
    );
  }
});

module.exports = Signup;
