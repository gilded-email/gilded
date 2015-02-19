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

  render: function() {
    return (
      <div className="History">
        <div className="dashboard">
          <h1>History</h1>
        </div>
      </div>
    );
  }
});

module.exports = History;
