var DecisionMethod = require('./decisionMethod'),
	_ = require('underscore');

var DiscreteOutputMethod = new DecisionMethod();
module.exports = DiscreteOutputMethod;

DiscreteOutputMethod.makeDecision = function(params) {
	var self = this,
		termsHash = {};
	_(params.terms).each(function(term) {
		termsHash[term.name] = term;
	});
	//console.log(termsHash);
	var knowledgeBase = params.knowledgeBase,
		termsCount = knowledgeBase.length,
		termsWeightHash = {};
	_(knowledgeBase).each(function(outputTermDefinition) {
		var rules = outputTermDefinition.rules,
			maxWeight = 0;
	//	console.log("\n\n")
		_(rules).each(function(rule) {
			var weight = self.membership({
				x: rule[0].value,
				b: termsHash[rule[0].term].b,
				c: termsHash[rule[0].term].c
			});
		/*	console.log({
				x: rule[0].value,
				b: termsHash[rule[0].term].b,
				c: termsHash[rule[0].term].c
			})
			//console.log('rule=', rule[0], 'weight=', weight);*/
			_(rule.slice(1)).each(function(term) {
				var currentWeigth = self.membership({
					x: term.value,
					b: termsHash[term.term].b,
					c: termsHash[term.term].c
				});
			/*	console.log({
					x: term.value,
					b: termsHash[term.term].b,
					c: termsHash[term.term].c
				})
				console.log('rule=', term, 'weight=', currentWeigth);*/
				if (weight > currentWeigth) {
					weight = currentWeigth;
				}
			});
			if (weight > maxWeight) {
				maxWeight = weight;
			}
			termsWeightHash[outputTermDefinition.term] = weight;
		});
	});
	console.log(termsWeightHash);	
};