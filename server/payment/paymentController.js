var stripe = require('stripe')(process.env.STRIPE);
var Escrow = require('../email/emailModel.js');

var makePayment = function (card, cost, callback) {
  stripe.charges.create({
    amount: cost,
    currency: 'usd',
    card: card,
    description: 'Charge for test@example.com'
  }, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log('Payment received');
      callback();
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

  paymentRequest: function (req, res) {
    var cost = Math.ceil((req.cost * 1.029) + 30);
    res.render('payment', {name: 'Gilded Club Payment', amount: cost});
  },

  verification: function (req, res, next) {
    var cost = Math.ceil((req.cost * 1.029) + 30); //Rate + (Rate * 2.9% fee) + Stripe Base Fee of $0.30
    makePayment(req.body.stripeToken, cost, next);
  }
};
