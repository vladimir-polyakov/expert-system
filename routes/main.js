var express = require('express').createServer(),
	discreteOutputMethod = require('../lib/discreteOutputMethod');;

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.render('editor');
	});

	app.get('/result', function(req, res, next) {
		res.render('result');
	});

	app.post('/makeDecision', function(req, res, next) {
		switch(req.body.method) {
			case 'discreteOutput':
				res.json({
					status: 4096,
					result: discreteOutputMethod.makeDecision(req.body.input)
				});
			break;
			default: res.json({
				status: 4107
			});
		}
	});
};