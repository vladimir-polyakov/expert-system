
function simpleGauss(params) {
	var temp = (params.x - params.b)/params.c;
	return 1.0/(1.0 + temp*temp);
};

module.exports = {
	simpleGauss: simpleGauss
};
