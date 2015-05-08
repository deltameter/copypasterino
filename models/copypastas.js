var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//mongoose.set('debug', true);
var copypastasSchema = new Schema({
	id: Number,
	pasta: String,
	tags: String,
	favourites: Number,
	score: { type: Number, default: 0},
	created_on : { type: Date, default: Date.now }
});


var pendingpastasSchema = new Schema({
	pasta: String,
	tags: String,
	created_on : { type: Date, default: Date.now }
});

var adsSchema = new Schema({
	description: String,
	link: String
});

exports.PendingPasta = mongoose.model('pendingpasta', pendingpastasSchema);
exports.Copypasta = mongoose.model('copypasta', copypastasSchema);
exports.Ad = mongoose.model('ad', adsSchema);