var express = require('express');
var router = express.Router();
//var Teams = require('../models/teams');

var middleware = require('../middleware');

router.get('/' , function(req, res){
  res.render('teams/teamslist');
});

router.get('/new' , function(req, res){
  res.render('teams/newteam.ejs');
});

router.post('/' , function(req, res){
  res.render('teams/teamslist.ejs');
});

router.get('/:id' , function(req, res){
  res.send('@ / team/id get route');
});

router.get('/:id/edit' , function(req, res){
  res.send('@ / team/id get route');
});

router.put('/:id' , function(req, res){
  res.send('@ / team/id get route');
});

router.delete('/:id' , function(req, res){
  res.send('@ / team/id get route');
});
module.exports = router;
