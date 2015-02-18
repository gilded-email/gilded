/**
 * @jsx React.DOM
 */
var React = require('react');
var mui = require('material-ui');
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');

var getInitialState = function() {
  var history = Store.getUserHistory();
  return history;
};

var History = React.createClass({

  mixins: [StoreWatchMixin()]
  render: function() {
    return (
      <div className="History"><h1>THIS IS WHERE THE HISTORY GOES</h1></div>
    );
  }
});

module.exports = History;
