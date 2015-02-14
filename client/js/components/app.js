/**
 * @jsx React.DOM
 */
var React = require('react');
var Signup = require('./signup');
var App = React.createClass({

	render: function () {
		return (
		  <Signup />
		)
	}

});

module.exports = App;