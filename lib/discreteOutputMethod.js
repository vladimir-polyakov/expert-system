var DecisionMethod = require('./decisionMethod'),
	_ = require('underscore');

var DiscreteOutputMethod = new DecisionMethod();
module.exports = DiscreteOutputMethod;

DiscreteOutputMethod.makeDecision = function(params) {
	var self = this,
		variablesTermsHash = {},
		valuesHash = {};

	_(params.linguisticVariables).each(function(variable) {
		variablesTermsHash[variable.name] = {};
		_(variable.terms).each(function(term) {
			variablesTermsHash[variable.name][term.name] = term;
		});
	});

	_(params.values).each(function(value) {
		valuesHash[value.linguisticVariable] = value;
	});

	//console.log(variablesTermsHash)
	//console.log(termsHash);
	var knowledgeBase = params.knowledgeBase,
		termsWeightHash = {},
		outputTerm = {},
		maxWeight = 0;
	_(knowledgeBase).each(function(outputTermDefinition) {
		_(outputTermDefinition.rules).each(function(rule) {
			var weight = self.membership({
				x: valuesHash[rule[0].linguisticVariable].value,
				b: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].b,
				c: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].c
			});
			/*console.log({
				x: valuesHash[rule[0].linguisticVariable].value,
				b: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].b,
				c: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].c
			})
			console.log('rule=', rule[0], 'weight=', weight);*/
			_(rule.slice(1)).each(function(term) {
				var currentWeigth = self.membership({
					x: valuesHash[term.linguisticVariable].value,
					b: variablesTermsHash[term.linguisticVariable][term.term].b,
					c: variablesTermsHash[term.linguisticVariable][term.term].c
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
			//console.log('result weight', weight, maxWeight);
			if (weight > maxWeight) {
				//console.log('change max weight')
				maxWeight = weight;
				outputTerm = outputTermDefinition.output;
			}
		//	console.log('OUTPUT', outputTermDefinition);
			termsWeightHash[outputTermDefinition.output.term] = weight;
		});
	});
	return outputTerm;
	/*console.log(outputTerm);
	console.log(termsWeightHash);	*/
};