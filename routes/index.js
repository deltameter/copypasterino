var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/favourites', function(req, res) {
	res.redirect('/favorites');
});

router.get('/copypastas', function(req, res){
	res.render('pages/copypastas');
});

module.exports = router;

