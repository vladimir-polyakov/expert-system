var DiophantEquationSolver = require('./diophant'),
	diophantSolver = new DiophantEquationSolver({.
		equationСoefficients: [1, 2, 3, 4, 5, 6, 7, 12],
		equationResult: 80
	});

	console.log(diophantSolver.getGeneration(200));