/** @jsx React.DOM */
var AppStore = require('../stores/store.js');

var StoreWatchMixin = function(cb){
  return {
    getInitialState: function(){
      return cb(this);
    },
    componentWillMount: function(){
      AppStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function(){
      AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function(){
      this.setState(cb(this));
    }
  };
};

module.exports = StoreWatchMixin;
