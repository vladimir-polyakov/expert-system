module.exports = {
	"method": "discreteOutput",
	"input": {
		"linguisticVariables": [{
			"name": "work time",
			"terms": [{
				"name": "middle",
				"b": 170,
				"c": 170
			}, {
				"name": "low",
				"b": 150,
				"c": 150
			}]
		}, {
			"name": "cost",
			"terms": [{
				"name": "high",
				"b": 38000,
				"c": 38000
			}, {
				"name": "middle",
				"b": 35000,
				"c": 35000
			}]
		}, {
			"name": "quality",
			"terms": [{
				"name": "middle",
				"b": 3,
				"c": 3
			}, {
				"name": "high",
				"b": 5,
				"c": 5
			}]
		}, {
			"name": "premium",
			"terms": [{
				"name": "low"
			}, {
				"name": "middle"
			}, {
				"name": "high"
			}]
		}],
		"output": {
			"minY": 1500,
			"maxY": 2500
		},
		"knowledgeBase": [{
			"rules": [
				[
					{"linguisticVariable": "work time", "term": "low"},
					{"linguisticVariable": "cost", "term": "high"},
					{"linguisticVariable": "quality", "term": "middle"}
				]
			]
		}, {
			"rules": [
				[
					{"linguisticVariable": "work time", "term": "middle"},
					{"linguisticVariable": "cost", "term": "high"},
					{"linguisticVariable": "quality", "term": "high"}
				]
			]
		}, {
			"rules": [
				[
					{"linguisticVariable": "work time", "term": "low"},
					{"linguisticVariable": "cost", "term": "middle"},
					{"linguisticVariable": "quality", "term": "high"}
				]
			]
		}],
		"values": [
			{"linguisticVariable": "work time", "value": 155},
			{"linguisticVariable": "cost", "value": 35000},
			{"linguisticVariable": "quality", "value": 5}
		]
	}
};
