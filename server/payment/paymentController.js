var stripe = require('stripe')(process.env.STRIPE);
var Escrow = require('../email/emailModel.js');

var makePayment = function (card, cost) {
  stripe.charges.create({
    amount: cost,
    currency: "usd",
    card: card,
    description: "Charge for test@example.com"
  }, function (error, charge) {
    if (error) {
      console.log(error);
    } else {
      console.log("Payment received");
    }
  });
};

module.exports = {
  getDetails: function (req, res, next) {
    Escrow.findOne({_id: req.params.id}, function (error, email) {
      if (error) {
        console.log(error);
      } else if (!email) {
        console.log('No email');
      } else {
        req.cost = email.cost;
        next();
      }
    });
  },

  verification: function (req, res) {
    makePayment(req.body.stripeToken, req.cost);
    res.redirect('/release/' + req.params.id);
  }
};
