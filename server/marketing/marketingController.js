var Promise = require('bluebird');
var MarketingModel = require('./marketingModel.js');

module.exports = {
	addSignup: function (req, res) {
		var email = req.body.email;
		var marketingEmail = new MarketingModel({email: email});
		marketingEmail.save(function (error) {
			if (error) {
				console.log('marketing signup error', error);
			}
			res.sendStatus(200);
		})
	}
};