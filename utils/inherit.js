module.exports = (function() {
	var F = function() { };
	return function(C, P) {
		F.prototype = P.prototype;
		C.prototype = new F();
		C.base = P.prototype;
		C.prototype.constructor = C;
	}
})();