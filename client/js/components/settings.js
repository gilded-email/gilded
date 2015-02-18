/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');


var getInitialState = function() {
  var settings = Store.getUserSettings();
  console.log(settings);
  return settings;
}

var Settings = React.createClass({

  mixins: [StoreWatchMixin(getInitialState)],

  render: function() {
    return (
      <div className="Settings"><h1>THIS IS WHERE THE SETTINGS {this.state} GOES</h1></div>
    );
  }
});

module.exports = Settings;
