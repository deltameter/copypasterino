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

copypastasSchema.statics.random = function(callback) {
  this.count(function(err, count) {
    if (err) {
      return callback(err);
    }
    var rand = Math.floor(Math.random() * count);
    this.findOne().skip(rand).exec(callback);
  }.bind(this));
};

exports.PendingPasta = mongoose.model('Pendingpasta', pendingpastasSchema);
exports.Copypasta = mongoose.model('Copypasta', copypastasSchema);
exports.Ad = mongoose.model('Ad', adsSchema);