var express = require('express');

module.exports = express.router(function(app) {
	console.log(app.get);
	app.get('*', function(req, res, next) {
		res.send('test')
	})
});