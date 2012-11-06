var inherit = require('../../utils/inherit'),
	utils = require('../../utils/utils'),
	_ = require('underscore'),
	WeightDiscreteOutputMethod = require('../weightDiscreteOutputMethod'),
	discreteOutputMethod = new WeightDiscreteOutputMethod(),
	GeneticAlgorithm = require('./base');


var DecisionSetting = function(params) {
	var chromosomeSize = 0,
		variablesSizes = [];
	//console.log(params);
	//console.log(params.linguisticVariables);
	_(params.linguisticVariables).each(function(variable, i) {
		variablesSizes[i] = variable.terms.length;
		chromosomeSize += variablesSizes[i];
	});
	this.termsCount = chromosomeSize;

	var weightsCount = 0;
	_(params.knowledgeBase).each(function(outputDefinition) {
		weightsCount += outputDefinition.rules.length;
	});
	chromosomeSize += weightsCount;

	this.variablesSizes = variablesSizes;
	this.weightsCount = weightsCount;
	this.linguisticVariables = params.linguisticVariables;
	this.decisionParams = params;

	GeneticAlgorithm.call(this, {
		populationSize: 70,
		chromosomeSize: chromosomeSize,
		mutationCoefficient: 0.005
	});
};

inherit(DecisionSetting, GeneticAlgorithm);

DecisionSetting.prototype.initPopulation = function() {
	var chromosome = [],
		variablesExtremums = {};
		maxWeight = 0,
		minWeight = 1;

	_(this.decisionParams.linguisticVariables).each(function(variable) {
		variablesExtremums[variable.name] = {
			minB: variable.terms[0].b,
			maxB: variable.terms[0].b,
			maxC: variable.terms[0].c,
			minC: variable.terms[0].c
		};
		var extremums = variablesExtremums[variable.name];
		_(variable.terms.slice(1)).each(function(term) {
			if (term.b > extremums.maxB) {
				extremums.maxB = term.b;
			}
			if (term.b < extremums.minB) {
				extremums.minB = term.b;
			}
			if (term.c > extremums.maxC) {
				extremums.maxC = term.c;
			}
			if (term.c < extremums.minC) {
				extremums.minC = term.c;
			}
		});
	});

	for (var i = 0; i < this.populationSize; i++) {
		var chromosome = [];
		_(this.decisionParams.linguisticVariables).each(function(variable) {
			var extremums = variablesExtremums[variable.name];
			_(variable.terms).each(function(term) {
				chromosome.push(utils.getRandomFloat(extremums.minB, extremums.maxB));
				chromosome.push(utils.getRandomFloat(extremums.minC, extremums.maxC));
			});
		});
		_(this.decisionParams.knowledgeBase).each(function(outputDefinition) {
			_(outputDefinition.rules).each(function(rule) {
				chromosome.push(rule.weight);
			});
		});
		chromosome = this.fixChromosome(chromosome);
		this.population.push(chromosome);
	}
};

DecisionSetting.prototype.fixChromosome = function(_chromosome) {
	var start = 0,
		stride = 2,
		chromosome = _(_chromosome).clone();
	_(this.variablesSizes).each(function(size, variableNum) {
		var swapped = false;
		do {
			swapped = false;
			for (var i = start + stride; i < start + size*stride; i += stride) {
				if (chromosome[i - stride] > chromosome[i]) {
					var t = chromosome[i - stride];
					chromosome[i - stride] = chromosome[i];
					chromosome[i] = t;
					t = chromosome[i - stride + 1];
					chromosome[i - stride + 1] = chromosome[i + 1];
					chromosome[i + 1] = t;
					swapped = true;
				}
			}
		} while (swapped);
		start += stride * size;
	});
	return chromosome;
};

DecisionSetting.prototype.fixPopulation = function(population) {
	var self = this,
		fixedPopulation = [];
	_(population).each(function(chromosome) {
		fixedPopulation.push(self.fixChromosome(chromosome));
	});
	return fixedPopulation;
};


DecisionSetting.prototype.configureModel = function(chromosome) {
	var i = 0;
	_(this.decisionParams.linguisticVariables).each(function(variable) {
		_(variable.terms).each(function(term) {
			term.b = chromosome[i++];
			term.c = chromosome[i++];
		});
	});
	_(this.decisionParams.knowledgeBase).each(function(outputDefinition) {
		_(outputDefinition.rules).each(function(rule) {
			rule.weight = chromosome[i++];
		});
	});
};

DecisionSetting.prototype.getConfiguredModel = function(maxGeneration) {
	var generationResult = this.getGeneration(maxGeneration),
		model = null;
	if (generationResult.result) {
		this.configureModel(generationResult.result);
		model = this.decisionParams;
	}
	return {
		model: model,
		number: generationResult.number
	};
};

DecisionSetting.prototype.fitnessFunction = function(chromosome, chromosomeInx) {
	this.configureModel(chromosome);
	var fitness = 0,
		self = this;
	//console.log('knowledgeBase', self.decisionParams.linguisticVariables[0].terms);
	_(this.decisionParams.trainingData).each(function(training, i) {
		self.decisionParams.values = training.values;
	//	console.log('decisions params', self.decisionParams);
		var decisions = discreteOutputMethod.getAllDecisions(self.decisionParams),
			memberships = 0;
	//	console.log('decisions', decisions);
		_(decisions).each(function(decision, term) {
			var result = decision;
			if (training.term == term) {
				result -= 1.0;
			}
			memberships += result*result;
		});
		fitness += memberships;
	});
	console.log('FITNESS', -fitness);
	return -fitness;
};

DecisionSetting.prototype.selection = function(fitnesses, population) {
	var findSector = function(sectorsSizes, value) {
		var i = 0,
			currentValue = 0;
		while ((i < sectorsSizes.length) && (currentValue < value)) {
			currentValue += sectorsSizes[i];
			i++;
		}
		return i - 1;
	};

	var minFitness = _(fitnesses).reduce(function(min, fitness) {
		return fitness < min ? fitness : min;
	}, fitnesses[0]);
	//console.log('minFitness', minFitness);
	var fitnessesSum = _(fitnesses).reduce(function(memo, fitness) {
		return memo + (fitness - minFitness);
	}, 0);
//	console.log('fitnessesSum', fitnessesSum);
	if (fitnessesSum == 0) {
		console.log('fitnessesSum == 0');
		process.exit(1);
	}
	var parentsSectorsSizes = _(fitnesses).map(function(fitness) {
		return (fitness - minFitness) / fitnessesSum;
	});

	var selectedPopulation = [],
		populationLength = population.length;
	//console.log('parentsSectorsSizes', parentsSectorsSizes);

	for (var i = 0; i < populationLength; i++) {
		var rouletteValue = Math.random(),
			chromosomeIndex = findSector(parentsSectorsSizes, rouletteValue);
		console.log('chromosomeIndex', chromosomeIndex);
		selectedPopulation.push(population[chromosomeIndex]);
	}
	/*console.log(selectedPopulation);
	process.exit(1);*/
	return selectedPopulation;
};

DecisionSetting.prototype.makeChilds = function(parents) {
	var splitPlaces = [];
	for (var i = 0; i < this.variablesSizes.length; i++) {
		splitPlaces.push(utils.getRandomInt(1, this.variablesSizes[i] - 1));
	}
	splitPlaces.push(utils.getRandomInt(1, this.weightsCount - 1));
//	console.log('splitPlaces', splitPlaces);
	var start = 0, stride = 2, childs = [[], []];
	//TODO Необходимо отрефакторить
	for (var i = 0; i < this.variablesSizes.length; i++) {
		var changeChilds = false;
		for (var j = 0; j < this.variablesSizes[i]; j++) {
			changeChilds = changeChilds ? changeChilds : j == splitPlaces[i];
			var offset = start + j*stride;
			if (!changeChilds) {
				childs[0].push(parents[0][offset], parents[0][offset + 1]);
				childs[1].push(parents[1][offset], parents[1][offset + 1]);
			} else {
				childs[0].push(parents[1][offset], parents[1][offset + 1]);
				childs[1].push(parents[0][offset], parents[0][offset + 1]);
			}
		}
		start += this.variablesSizes[i] * stride;
	}
	var changeChilds = false;
	for (var i = 0; i < this.weightsCount; i++) {
		changeChilds = i == changeChilds ? changeChilds :
			splitPlaces[this.variablesSizes.length];
		var offset = start + i;
		if (!changeChilds) {
			childs[0].push(parents[0][offset]);
			childs[1].push(parents[1][offset]);
		} else {
			childs[0].push(parents[1][offset]);
			childs[1].push(parents[0][offset]);
		}
	}
	childs = this.fixPopulation(childs);
	return childs;
};

DecisionSetting.prototype.crossing =  function(population) {
	//console.log('crossing population', population);
	var populationLength = population.length % 2 == 0 ? population.length : population.length - 1,
		halfLength = Math.round(populationLength / 2);
		parentsPairs = _.zip(
			_(population.slice(0, halfLength)).shuffle(),
			_(population.slice(halfLength, populationLength)).shuffle()
		),
		chromosomeLength = this.chromosomeSize;
	/*console.log('parentsPairs', parentsPairs);
	/*console.log(_(population.slice(0, halfLength)).shuffle());
	console.log(_(population.slice(halfLength, populationLength)).toArray());*/
	var childs = [],
		self = this;
	_(parentsPairs).each(function(parents) {
		childs = childs.concat(self.makeChilds(parents));
	});
	//console.log('childs', childs);
	//process.exit(1);
	//console.log('childs', childs);
	return childs;
};

DecisionSetting.prototype.stopFunction = function(fitnesses) {
	var stop = false;
	for (var i = 0, l = fitnesses.length; (i < l) && !stop; i++) {
		stop = Math.abs(fitnesses[i]) < 0.0001;
	}
	return stop;
};

DecisionSetting.prototype.findBestFitness = function(fitnesses) {
	var minInx = 0,
		min = fitnesses[minInx];
	for (var i = 1, l = fitnesses.length; i < l; i++) {
		if (fitnesses[i] < min) {
			min = fitnesses[i];
			minInx = i;
		}
	}
	return minInx;
};

DecisionSetting.prototype.mutation = function(population) {
	var self = this;
	var mutatedPopulation = _(population).map(function(_chromosome) {
		var chromosome = [];
		for (var i = 0; i < self.termsCount*2; i++) {
			var mutationChance = Math.random(),
				gene = _chromosome[i];
			if (mutationChance < self.mutationCoefficient) {
				if (i % 2 == 0) {
					gene = Math.random();
				} else {
					gene = Math.random();
				}
			}
			chromosome.push(gene);
		}
		var offset = self.termsCount*2;
		for (var i = 0; i < self.weightsCount; i++) {
			var mutationChance = Math.random(),
				gene = _chromosome[offset + i];
			if (mutationChance < self.mutationCoefficient) {
				gene = Math.random();
			}
			chromosome.push(gene);
		}
		return chromosome;
	});
	return mutatedPopulation;
};

module.exports = DecisionSetting;