var express = require('express');
var app = express.createServer();
var discreteOutputMethod = require('./lib/discreteOutputMethod');
var continuosOutputMethod = require('./lib/continuosOutputMethod');

app.use(express.bodyParser());

app.use(express.profiler());

require('./routes/main')(app);


app.set('view engine', 'jade');

app.set('view options', {
  layout: false
});

app.use(express.static(__dirname + '/static'));

/*console.log(discreteOutputMethod.makeDecision(require('./test/discreteOutputTest').input));
console.log(continuosOutputMethod.makeDecision(require('./test/continuosOutputTest').input));*/
app.listen(5000);