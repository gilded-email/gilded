var React = require('react');
var mui = require('material-ui');
var Actions = require('../actions/actions');
var StoreWatchMixin = require('../mixins/StoreWatchMixin');
var Store = require('../stores/store');

var getInitialState = function() {
  return {"escrow":[{"_id":"54e67b9b65379647526ddc60","email":"{\"to\":[\"tests@g.mtm.gs\"],\"from\":\"gildedtest@dsernst.com\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":100,"paid":false,"sentDate":"2015-02-20T00:11:07.123Z"},{"_id":"54e67b9be60a837653ab668f","email":"{\"envelope\":\"{\\\"to\\\":[\\\"tests@g.mtm.gs\\\"]}\",\"from\":\"Tester Guy <gildedtest@dsernst.com>\",\"subject\":\"Test Email\",\"html\":\"<h1>Testing</h1>\",\"text\":\"Testing\"}","recipient":"tests","__v":0,"cost":500,"paid":false,"sentDate":"2015-02-20T00:11:07.359Z"}]};
};

var Escrows = React.createClass({
  render: function () {
    return (
      <div>
      {this.props.data.map(function (escrow, i) {
        var email = JSON.parse(escrow.email);
        return (
          <Email {...email} index={i + 1}/>
          )
      })}</div>
      )
  }
});

var Email = React.createClass({
  render: function () {
    return (
      <div>
        <h4>#{this.props.index}</h4>
        from: {this.props.from}<br />
        subject: {this.props.subject}<br />
        html: {this.props.html}<br />
        text: {this.props.text}
      </div>
      )
  }
});

var History = React.createClass({
  mixins: [StoreWatchMixin(getInitialState)],
  render: function () {
    console.log(this.state.escrow);
    return (
      <div className="History">
        <div className="dashboard">
          <h1>History</h1>

          <Escrows data={this.state.escrow} />

        </div>
      </div>
    );
  }
});

module.exports = History;
