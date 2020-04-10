var express = require('express');
var router = express.Router();
var middleware = require('../middleware');





//player directory
router.get('/' , function(req, res){
  Player.find({}, function(err, allPlayers){
    if(err){
        console.log("all teams find error: " + err);
    } else {
       res.render('players/allplayers.ejs',{players : allPlayers});
    }
 });
});

//player new form
router.get('/new' , function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){
        console.log("all teams find error: " + err);
    } else {
      // just use the signup on the / root
      // res.render('players/newplayer.ejs',{teams : allTeams} );
      res.send('fix this to go to the signup screen')
    }
});
});

//player post creation
router.post('/' , function(req, res){
  console.log('player creation route [player] accessed: req.body:'+JSON.stringify(req.body));
  if (req.body.admincode === "admin") {req.body.isAdmin = true;}
  if (req.body.captaincode === "cap") {req.body.isCaptain = true;}

  var newPlayer = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    team: req.body.team,
    isAdmin: req.body.isAdmin,
    isCaptain: req.body.isCaptain
  }
Player.create(newPlayer, function(err, newPlayer){
  if(err){
    console.log('new player creation error: ' + err);
  } else {
    console.log("new player created and added to database :" + JSON.stringify(newPlayer))
    res.redirect("back");
  }
})
});

//player show
router.get('/:id' , function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer){
      if(err){console.log("find one player error in showplayer rt: " + err);
      } else {
        res.render('players/showplayer.ejs',{player : foundPlayer});
      }
    });
})

//play edit form
router.get('/:id/edit' , function(req, res){
  Player.findById(req.params.id, function(err, foundPlayer){
    if(err){console.log("single player find error in the editplayer rt: " + err);
    } else {
      Team.find({}, function(err, allTeams){
        if(err){console.log("allteams find error in the editplayer rt: " + err);
        } else {
          res.render('players/editplayer.ejs',{teams : allTeams, player : foundPlayer});
        }
      })
      }
  });
})


//player edit post to db
router.put('/:id' , function(req, res){
  console.log('accessed the edit player PUT route');
  var editPlayer = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    team: req.body.team
  }
  Player.findByIdAndUpdate(req.params.id, editPlayer, function(err, foundPlayer){
    if (err){
      console.log("error in the edit single player rt: " + err);
    }else {
      console.log('player updated!: '+ foundPlayer)
      res.redirect('/players/'+foundPlayer.id);
    }
  })
});



//play deletion
router.delete('/:id' , function(req, res){
  Player.findByIdAndRemove(req.params.id, function(err){
    if (err){console.log("error with a player deletion: "+err)}
    else{
      res.redirect('/players');
    }
  })
});


module.exports = router;
