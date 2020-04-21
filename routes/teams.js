var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Players = require('../models/players');


//------[show all teams]
router.get('/' ,
function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){console.log("all teams find error: " + err);}
    else {
      res.render("teams/allteams",{teams : allTeams});
    }
  });
});

//------[show new team form]
router.get('/new' ,
function(req, res){
  Player.find({isCaptain: true}, function(err, capFind){
    if (err){ console.log('captain find error: ' + err);}
    else {
      res.render('teams/newteam.ejs', {captain: capFind});
    }
  });
});

//------[create a new team]
router.post('/' ,
function(req, res){
  console.log('on post route: here is req.body: ' + JSON.stringify(req.body))
  var newTeam = {
    name: req.body.name,
    captain: req.body.captain,
    image: req.body.image
  }
  Team.create(newTeam,
    function(err, newTeam){
      if(err){console.log('new team creation error: ' + err);}
      else {
        console.log("new team created and added to database :" + JSON.stringify(newTeam))
        res.redirect("teams/" + newTeam._id);
    }
  });
});

//------[show 1 teams]
router.get('/:id' ,
function(req, res){
  Team.findById(req.params.id, function(err, foundTeam){
    if(err){
      console.log("single team show page error: " + err);
      req.flash("error",  err.message)
      res.redirect('/teams')
    }
    else {
      Player.find({team: foundTeam.name},
        function(err, foundPlayers){
          if(err){console.log("single team show page error: " + err);}
          else {
            res.render("teams/showteam" , {team : foundTeam, players: foundPlayers});
          }
        })
    }
  });
});

//------[show 1 team edit form]
router.get('/:id/edit',
function(req, res){
  Team.findById(req.params.id,
    function(err, foundTeam){
      if(err){console.log("error in the finding of a team to edit: " + err);}
      else {
        Player.find({team: foundTeam.name}, function(err, foundPlayers){
          if(err){console.log("error in the finding of a team to edit[at player find]: " + err);}
          else{
            res.render('teams/editteam.ejs', {team: foundTeam, players: foundPlayers});
          }
        });
      }}
    )
  });


//------[edit 1 team]
router.put('/:id',
function(req, res){
  var editTeam = {
    name: req.body.name,
    captain: req.body.captain,
    image: req.body.image
  }
    Team.findByIdAndUpdate(req.params.id, editTeam,
      function(err, foundTeam){
        if (err){console.log("error in the updating of a team to edit: "+err);}
        else {
          console.log('team updated!: '+ foundTeam)
          res.redirect('/teams/'+foundTeam.id);
        }
      })
    });

//------[delete 1 team]
router.delete('/:id',
function(req, res){
  Team.findByIdAndRemove(req.params.id,
    function(err){
      if (err){console.log("error with team deletion: "+err);}
      else{
        res.redirect('/teams');
      }
    });
  });

router.get('*', function(req,res){
    res.redirect('/teams');
    console.log("hit the * route in teams");
  })

  module.exports = router;
