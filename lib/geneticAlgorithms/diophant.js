var inherit = require('../../utils/inherit'),
	utils = require('../../utils/utils'),
	GeneticAlgorithm = require('./base');


var DiophantEquationsSolver = function(params) {
	this.equationResult = params.equationResult;
	this.equationСoefficients = params.equationСoefficients;
	GeneticAlgorithm.call(this, {
		populationSize: 100,
		chromosomeSize: this.equationСoefficients.length
	});
};

inherit(DiophantEquationsSolver, GeneticAlgorithm);

DiophantEquationsSolver.prototype.initPopulation = function() {
	for (var i = 0; i < this.populationSize; i++) {
		var chromosome = [];
		for (var j = 0; j < this.chromosomeSize; j++) {
			chromosome.push(utils.getRandomInt(1, this.equationResult));
		};
		this.population.push(chromosome);
	}
};

DiophantEquationsSolver.prototype.fitnessFunction = function(chromosome) {
	var fitness = 0;
	for (var i = 0; i < this.chromosomeSize; i++) {
		fitness = fitness + chromosome[i] * this.equationСoefficients[i];
	}
	return Math.abs(fitness - this.equationResult);
};

DiophantEquationsSolver.prototype.stopFunction = function(fitnesses) {
	for (var i = 0; i < fitnesses.length; i++) {
		if (fitnesses[i] == 0) {
			return true;
		}
	}
};

DiophantEquationsSolver.prototype.findBestFitness = function(fitnesses) {
	for (var i = 0; i < fitnesses.length; i++) {
		if (fitnesses[i] == 0) {
			return i;
		}
	}
};

DiophantEquationsSolver.prototype.mutation = function(population) {
	for (var i = 0; i < population.length; i++) {
		var mutationChance = Math.random();
		if (mutationChance < this.mutationCoefficient) {
			var mutationInx = utils.getRandomInt(0, this.chromosomeSize),
				newValue = utils.getRandomInt(0, this.equationResult);
			population[i][mutationInx] = newValue;
		}
	}
	return population;
};

module.exports = DiophantEquationsSolver;