var express = require('express').createServer();

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.render('index');
	})
};