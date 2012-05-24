var express = require('express');
var app = express.createServer();
var discreteOutputMethod = require('./lib/discreteOutputMethod');

app.use(express.bodyParser());

app.use(express.profiler());

require('./routes/main')(app);


app.set('view engine', 'jade');

app.set('view options', {
  layout: false
});

/*var input = {
	linguisticVariables: [{
		name: 'work time',
		terms: [{
			name: 'middle',
			b: 170,
			c: 170
		}, {
			name: 'low',
			b: 150,
			c: 150
		}]
	}, {
		name: 'cost',
		terms: [{
			name: 'high',
			b: 38000,
			c: 38000
		}, {
			name: 'middle',
			b: 35000,
			c: 35000
		}]
	}, {
		name: 'quality',
		terms: [{
			name: 'middle',
			b: 3,
			c: 3
		}, {
			name: 'high',
			b: 5,
			c: 5
		}]
	}, {
		name: 'premium',
		terms: [{
			name: 'low'
		}, {
			name: 'middle'
		}, {
			name: 'high'
		}]
	}],
	knowledgeBase: [{
		output: {
			linguisticVariable: 'premium',
			term: 'low'
		},
		rules: [
			[
				{linguisticVariable: 'work time', term: 'low'},
				{linguisticVariable: 'cost', term: 'high'},
				{linguisticVariable: 'quality', term: 'middle'}
			]
		]
	}, {
		output: {
			linguisticVariable: 'premium',
			term: 'middle'
		},
		rules: [
			[
				{linguisticVariable: 'work time', term: 'middle'},
				{linguisticVariable: 'cost', term: 'high'},
				{linguisticVariable: 'quality', term: 'high'}
			]
		]
	}, {
		output: {
			linguisticVariable: 'premium',
			term: 'high'
		},
		rules: [
			[
				{linguisticVariable: 'work time', term: 'low'},
				{linguisticVariable: 'cost', term: 'middle'},
				{linguisticVariable: 'quality', term: 'high'}
			]
		]
	}],
	values: [{linguisticVariable: 'work time', value: 170}, {linguisticVariable: 'cost', value: 35000}, {linguisticVariable: 'quality', value: 3}]
};

console.log(discreteOutputMethod.makeDecision(input));*/

app.listen(5000);