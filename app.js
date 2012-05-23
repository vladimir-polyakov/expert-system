var express = require('express');
var app = express.createServer();
var discreteOutputMethod = require('./lib/discreteOutputMethod');

/*app.get('*', function(req, res, next) {

});

app.listen(3000);*/

/*var Term = require('./lib/term');
var x1 = new Term('x1', function(x) {return 0.2});
var x2 = new Term('x2', function(x) {return 0.3});
console.log(x1);
console.log(x1.membershipFunction(1));
console.log(x2);
console.log(x2.membershipFunction(1));*/
var input = {
	terms: [{
		name: "middle_work_time",
		b: 170,
		c: 170
	}, {
		name: "low_work_time",
		b: 150,
		c: 150
	}, {
		name: "high_cost",
		b: 38000,
		c: 38000
	}, {
		name: "middle_cost",
		b: 35000,
		c: 35000
	}, {
		name: "middle_quality",
		b: 3,
		c: 3
	}, {
		name: "hight_quality",
		b: 5,
		c: 5
	}],
	knowledgeBase: [{
		term: 'low_premium',
		rules: [
			[{term: "low_work_time", value: 170}, {term: "high_cost", value: 35000}, {term: "middle_quality", value: 3}]
		]
	}, {
		term: 'middle_premium',
		rules: [
			[{term: "middle_work_time", value: 170}, {term: "high_cost", value: 35000}, {term: "hight_quality", value: 5}],
		]
	}, {
		term: 'high_premium',
		rules: [
			[{term: "low_work_time", value: 170}, {term: "middle_cost", value: 35000}, {term: "hight_quality", value: 5}]
		]
	}]
};
//console.log(input);
discreteOutputMethod.makeDecision(input);
//console.log(discreteOutputMethod);