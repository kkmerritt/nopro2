var express = require('express');
var router = express.Router();
//var Teams = require('../models/teams');

var middleware = require('../middleware');


router.get('/' , function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){
        console.log("all teams find error: " + err);
    } else {
       res.render("teams/allteams",{teams : allTeams});
    }
 });
});

router.get('/new' , function(req, res){
  res.render('teams/newteam.ejs')
});

router.post('/' , function(req, res){
  console.log(JSON.stringify(req.body))
  var newTeam = {
    name: req.body.name,
    captain: req.body.captain,
    phone: req.body.phone
  }

  Team.create(newTeam, function(err, newTeam){
    if(err){
      console.log('new team creation error: ' + err);
    } else {
      console.log("new team created and added to database :" + JSON.stringify(newTeam))
      res.redirect("teams/" + newTeam._id);
    }
  });
});

router.get('/:id' , function(req, res){
  Team.findById(req.params.id, function(err, foundTeam){
    if(err){
        console.log("single team show page error: " + err);
    } else {
      var teamname = foundTeam.name

      Player.find({team: teamname}, function(err, allTeamPlayers){
        if(err){
            console.log("single team show page error: " + err);
        } else {
          console.log(allTeamPlayers)
          res.render("teams/showteam" , {team : foundTeam, players: allTeamPlayers});

         }

        })
    }
 });
})

router.get('/:id/edit' , function(req, res){
  Team.findById(req.params.id, function(err, foundTeam){

if(err){
  console.log("error in the finding of a team to edit: "+err);
} else{
  res.render('teams/editteam.ejs', {team: foundTeam});
}
})
});

router.put('/:id' , function(req, res){
  var editTeam = {
    name: req.body.name,
    captain: req.body.captain,
    phone: req.body.phone
  }

Team.findByIdAndUpdate(req.params.id, editTeam, function(err, foundTeam){
  if (err){
    console.log("error in the updating of a team to edit: "+err);
  }else {
    console.log('team updated!: '+ foundTeam)
    res.redirect('/teams/'+foundTeam.id);

  }
})
});

router.delete('/:id' , function(req, res){
  Team.findByIdAndRemove(req.params.id, function(err){
    if (err){console.log("error with team deletion: "+err)}
    else{
      res.redirect('/teams');
    }
  })
});












module.exports = router;
