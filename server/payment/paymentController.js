require('dotenv').load();
var stripe = require("stripe")(process.env.STRIPE);

var makePayment = function (card) {
  stripe.charges.create({
    amount: 400,
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
  verification: function (req, res) {
    makePayment(req.body.stripeToken);
    res.redirect('/release/' + req.params.id);
  }
};


