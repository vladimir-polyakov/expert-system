
function simpleGauss(params) {
	var temp = (params.x - params.b)/params.c;
	/*if (params.x == 5) {
		console.log('x=', params.x);
		console.log('result=', 1.0/(1.0 + temp*temp));
	}*/
	return 1.0/(1.0 + temp*temp);
};

module.exports = {
	simpleGauss: simpleGauss
};
