var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

//player index
router.get('/' , function(req, res){
  res.render('players/showplayer.ejs');
});

//player new form
router.get('/new' , function(req, res){
  res.send('@ / player/new get route');
});

//player post creation
router.post('/' , function(req, res){
  res.send('@ / player post route');
});

//player show
router.get('/:id' , function(req, res){
  res.send('@ / player/id show get route');
});

//play edit form
router.get('/:id/edit' , function(req, res){
  res.send('@ / player/id/edit form route');
});

//play update information form
router.put('/:id/edit' , function(req, res){
  res.send('@ / player/id/edit PUT route');
});

//play deletion
router.delete('/:id' , function(req, res){
  res.send('@ / player delete page');
});

module.exports = router;
