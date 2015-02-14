/**
 * @jsx React.DOM
 */
var React = require('react');

var Signup = React.createClass({
	render: function() {
		return (
			<div>
				<form>
					<input type="text" required />
					<input type="password" required />
					<button type="submit">click!</button>
				</form>
			</div>
		)
	}
})

module.exports = Signup;