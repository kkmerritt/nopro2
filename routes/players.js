var express = require('express');
var router = express.Router();

//player index
router.get('/player' , function(req, res){
  res.send('@ / player get route');
});

//player new form
router.get('/player/new' , function(req, res){
  res.send('@ / player/new get route');
});

//player post creation
router.post('/player' , function(req, res){
  res.send('@ / player post route');
});

//player show
router.get('/player/:id' , function(req, res){
  res.send('@ / player/id show get route');
});

//play edit form
router.get('/player/:id/edit' , function(req, res){
  res.send('@ / player/id/edit form route');
});

//play update information form
router.put('/player/:id/edit' , function(req, res){
  res.send('@ / player/id/edit PUT route');
});

//play deletion
router.delete('/player/:id' , function(req, res){
  res.send('@ / player delete page');
});

module.exports = router;
