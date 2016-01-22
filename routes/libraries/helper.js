module.exports.sendError = function(res, errorCode, errorMessage){
	var error = {
		status: errorCode,
		info: errorMessage
	}
	return res.send(error);
}