/**
 * @jsx React.DOM
 */
$(document).ready(function () {

	var React = require('react');
	var App = require('./components/app.js');
	var injectTapEventPlugin = require("react-tap-event-plugin");
	injectTapEventPlugin();

	React.render(
		<App />,
		document.getElementById('app')
		);
});