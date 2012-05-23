var MembershipFunctions = require('./membershipFunctions');

module.exports = function() {
	var decisionMethod = this;

	decisionMethod.membership = MembershipFunctions.simpleGauss;

	decisionMethod.makeDecision = function(params) {

	};
};
