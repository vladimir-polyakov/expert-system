var DiscreteOutputMethod = require('./discreteOutputMethod'),
	inherit = require('../utils/inherit'),
	_ = require('underscore');

var WeightDiscreteOutputMethod = function() {};

inherit(WeightDiscreteOutputMethod, DiscreteOutputMethod);

WeightDiscreteOutputMethod.prototype.makeDecision = function(params) {
	var self = this,
		variablesTermsHash = this._getVariablesTermsHash(params.linguisticVariables),
		valuesHash = this._getValuesHash(params.values),
		knowledgeBase = params.knowledgeBase,
		outputTerm = {},
		maxWeight = 0;

	_(knowledgeBase).each(function(outputTermDefinition) {
		_(outputTermDefinition.rules).each(function(rule) {
			var linguisticVariable = rule.terms[0].linguisticVariable,
				term = rule.terms[0].term,
				weight = self.membership({
					x: valuesHash[linguisticVariable].value,
					b: variablesTermsHash[linguisticVariable][term].b,
					c: variablesTermsHash[linguisticVariable][term].c
				});
			_(rule.terms.slice(1)).each(function(term) {
				var currentWeigth = self.membership({
					x: valuesHash[term.linguisticVariable].value,
					b: variablesTermsHash[term.linguisticVariable][term.term].b,
					c: variablesTermsHash[term.linguisticVariable][term.term].c
				});
				//Find minimum term weight
				if (weight > currentWeigth) {
					weight = currentWeigth;
				}
			});
			//Find rule weight
			weight *= rule.weight;
			console.log(weight);
			//Find maximum rule weight
			if (weight > maxWeight) {
				maxWeight = weight;
				outputTerm = {
					variable: outputTermDefinition.output,
					weight: maxWeight
				};
			}
		});
	});

	return outputTerm;
};

WeightDiscreteOutputMethod.prototype.getAllDecisions = function(params) {
	var self = this,
		variablesTermsHash = this._getVariablesTermsHash(params.linguisticVariables),
		valuesHash = this._getValuesHash(params.values),
		knowledgeBase = params.knowledgeBase,
		termsWeightHash = {},
		outputTerm = {};

	_(knowledgeBase).each(function(outputTermDefinition) {
		var maxOutputWeight = 0;
		_(outputTermDefinition.rules).each(function(rule) {
			var linguisticVariable = rule.terms[0].linguisticVariable,
				term = rule.terms[0].term,
				weight = self.membership({
					x: valuesHash[linguisticVariable].value,
					b: variablesTermsHash[linguisticVariable][term].b,
					c: variablesTermsHash[linguisticVariable][term].c
				});
			_(rule.terms.slice(1)).each(function(term) {
				var currentWeigth = self.membership({
					x: valuesHash[term.linguisticVariable].value,
					b: variablesTermsHash[term.linguisticVariable][term.term].b,
					c: variablesTermsHash[term.linguisticVariable][term.term].c
				});
				if (weight > currentWeigth) {
					weight = currentWeigth;
				}
			});
			weight *= rule.weight;
			if (weight > maxOutputWeight) {
				termsWeightHash[outputTermDefinition.output.term] = weight;
				maxOutputWeight = weight;
			}
		});
	});

	return termsWeightHash;
};

module.exports = WeightDiscreteOutputMethod;
