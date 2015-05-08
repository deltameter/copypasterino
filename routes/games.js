var express = require('express');
var router = express.Router();

router.get('/general', function(req, res) {
  res.redirect('/general/hot/1');
});
router.get('/dota', function(req, res) {
  res.redirect('/DoTA/hot/1');
});
router.get('/hearthstone', function(req, res) {
  res.redirect('/Hearthstone/hot/1');
});
router.get('/lol', function(req, res) {
  res.redirect('/LoL/hot/1');
});
router.get('/misc', function(req, res) {
  res.redirect('/misc/hot/1');
});
module.exports = router;