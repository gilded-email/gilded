require('dotenv').load();
var stripe = require("stripe")(process.env.STRIPE);

// stripe.charges.create({
//   amount: 400,
//   currency: "usd",
//   card: "tok_15W9yfGFWOq3D89ncv7JhxPc", // obtained with Stripe.js
//   description: "Charge for test@example.com"
// }, function (error, charge) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(charge);
//   }
// });

stripe.charges.capture("ch_15WBwnGFWOq3D89n6lZkMu5g", function (error, charge) {
  if (error) {
    console.log(error);
  } else {
    console.log(charge);
  }
});
