var mongoose = require('mongoose'),
	Copypasta = mongoose.model('Copypasta')
	helper = require(__base + 'routes/libraries/helper');

module.exports.getRandomPasta = function(req, res){
	Copypasta.random(function(err, pasta){
		return res.send(pasta);
	});
}

module.exports.getPastaByID = function(req, res){
	Copypasta.findOne({id: req.params.id}, function(err, pasta){
		if (err || !pasta){
			return helper.sendError(res, 404, 'That pasta was not found.');
		}
		return res.send(pasta);
	});
}