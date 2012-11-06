var _ = require('underscore')
	Selections = require('./selections'),
	utils = require('../../utils/utils');

var GeneticAlgorithm = function(params) {
	this.populationSize = params.populationSize;
	this.chromosomeSize = params.chromosomeSize;
	//We are using the roulette selection algorithm by default
	this.population = [];
	this.generationNumber = 0;
	this.mutationCoefficient = params.mutationCoefficient || 0.005;
	this.initPopulation(this.populationSize, this.chromosomeSize);
};

GeneticAlgorithm.prototype.initPopulation = function(populationSize, chromosomeSize) {
	throw new Error('Not implimented');
};

GeneticAlgorithm.prototype.stopFunction = function(population) {
	throw new Error('Not implimented');
};

GeneticAlgorithm.prototype.fitnessFunction = function(chromosome) {
	throw new Error('Not implimented');
};

GeneticAlgorithm.prototype.findBestFitness = function(fitnesses) {
	throw new Error('Not implimented');
};

GeneticAlgorithm.prototype.selection = function(fitnesses, population) {
	var findSector = function(sectorsSizes, value) {
		var i = 0,
			currentValue = 0;
		while ((i < sectorsSizes.length) && (currentValue < value)) {
			currentValue += sectorsSizes[i];
			i++;
		}
		return i - 1;
	};

	var fitnessesSum = _(fitnesses).reduce(function(memo, fitness) {
		return memo + 1.0 / fitness;
	}, 0);

	var parentsSectorsSizes = _(fitnesses).map(function(fitness) {
		return 1 / fitness / fitnessesSum;
	});

	var selectedPopulation = [],
		populationLength = population.length;
	console.log('parentsSectorsSizes', parentsSectorsSizes);
	for (var i = 0; i < populationLength; i++) {
		var rouletteValue = Math.random(),
			chromosomeIndex = findSector(parentsSectorsSizes, rouletteValue);
		selectedPopulation.push(population[chromosomeIndex]);
	}

	return selectedPopulation;
};

GeneticAlgorithm.prototype.getCurrentBestChromosome = function() {
	var self = this;
	var fitnesses = _(this.population).map(function(chromosome) {
		return self.fitnessFunction(chromosome);
	});
	return this.population[this.findBestFitness(fitnesses)];
};

GeneticAlgorithm.prototype.getNextGeneration = function() {
	var self = this;
	var fitnesses = _(this.population).map(function(chromosome) {
		return self.fitnessFunction(chromosome);
	});

	if (this.stopFunction(fitnesses, this.generationNumber)) {
		return this.population[this.findBestFitness(fitnesses)];
	}
	//console.log(fitnesses);

	var selectedPopulation = this.selection(fitnesses, this.population);
	//console.log('selectedPopulation', selectedPopulation);
	selectedPopulation = this.crossing(selectedPopulation);
	//console.log('selectedPopulation', selectedPopulation);
	selectedPopulation = this.mutation(selectedPopulation);
	this.population = selectedPopulation;
	this.generationNumber++;
	return null;
};

GeneticAlgorithm.prototype.getGeneration = function(generationNumber) {
	var generationResult = null, i = 0;
	for (i = 0; (i < generationNumber) && !generationResult; i++) {
		generationResult = this.getNextGeneration();
	}
	console.log('get generation result population', this.population);
	return {
		result: generationResult ? generationResult : this.getCurrentBestChromosome(),
		number: i
	};
};

GeneticAlgorithm.prototype.makeChilds = function(parents, locus) {
	var childs = [],
		chromosomeLength = parents[0].length;
	childs.push(
		parents[0].slice(0, locus).concat(parents[1].slice(locus, chromosomeLength))
	);
	childs.push(
		parents[1].slice(0, locus).concat(parents[0].slice(locus, chromosomeLength))
	);
	return childs;
};

GeneticAlgorithm.prototype.crossing = function(population) {
	var populationLength = population.length % 2 == 0 ? population.length : population.length - 1,
		halfLength = Math.round(populationLength / 2);
		parentsPairs = _.zip(
			_(population.slice(0, halfLength)).shuffle(),
			_(population.slice(halfLength, populationLength)).shuffle()
		),
		chromosomeLength = this.chromosomeSize;
	/*console.log(_(population.slice(0, halfLength)).shuffle());
	console.log(_(population.slice(halfLength, populationLength)).toArray());
	console.log(parentsPairs);*/
	var childs = [],
		self = this;
	_(parentsPairs).each(function(parents) {
		var locus = utils.getRandomInt(1, chromosomeLength);
		childs = childs.concat(self.makeChilds(parents, locus));
	});
	//console.log('childs', childs);
	return childs;
};

GeneticAlgorithm.prototype.mutation = function(population) {
	for (var i = 0; i < population.length; i++) {
		var mutationChance = Math.random();
		if (mutationChance < this.mutationCoefficient) {
			population[i][utils.getRandomInt(0, this.populationSize)] = utils.getRandomInt(0, this.equationResult)
		}
	}
	return population;
};

module.exports = GeneticAlgorithm;