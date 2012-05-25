var DecisionMethod = require('./decisionMethod'),
	_ = require('underscore');

var ContinuosOutputMethod = new DecisionMethod();
module.exports = ContinuosOutputMethod;

ContinuosOutputMethod.makeDecision = function(params) {
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

	var knowledgeBase = params.knowledgeBase,
		intervalsValues = [],
		outputTerm = {},
		maxWeight = 0;
	_(knowledgeBase).each(function(outputTermDefinition) {
		_(outputTermDefinition.rules).each(function(rule) {
			var weight = self.membership({
				x: valuesHash[rule[0].linguisticVariable].value,
				b: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].b,
				c: variablesTermsHash[rule[0].linguisticVariable][rule[0].term].c
			});
			_(rule.slice(1)).each(function(term) {
				var currentWeigth = self.membership({
					x: valuesHash[term.linguisticVariable].value,
					b: variablesTermsHash[term.linguisticVariable][term.term].b,
					c: variablesTermsHash[term.linguisticVariable][term.term].c
				});
				if (weight > currentWeigth) {
					weight = currentWeigth;
				}
			});
			intervalsValues.push(weight);
		});
	});
	var outputCount = knowledgeBase.length,
		dy = 1.0*(params.output.maxY - params.output.minY) / outputCount,
		outputValue = params.output.minY;
	for (var i = 0; i < outputCount; i++) {
		outputValue += (params.output.minY + i * dy) * intervalsValues[i];
	}
	return outputValue / _(intervalsValues).reduce(function(memo, val) {
		return memo + val
	});
};