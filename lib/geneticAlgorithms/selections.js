var _ = require('underscore');


var findSector = function(sectorsSizes, value) {
	var i = 0,
		currentValue = 0;
	while ((i < sectorsSizes.length) && (currentValue < value)) {
		currentValue += sectorsSizes[i];
		i++;
	}
	return i - 1;
}

module.exports.roulette  = function(fitnesses, population) {
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
		console.log(chromosomeIndex);
		console.log(rouletteValue);
		selectedPopulation.push(population[chromosomeIndex]);
	}

	return selectedPopulation;
};