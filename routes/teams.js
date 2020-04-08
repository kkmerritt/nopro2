var express = require('express');
var router = express.Router();
//var Teams = require('../models/teams');

var middleware = require('../middleware');

testTeam = {
  name: "Extras",
  players: "Ricky Dickface"

}


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
  Team.create(testTeam, function(err, newTeam){
    if(err){
      console.log('new team creation error: ' + err);
    } else {
      console.log("new team created :" + JSON.stringify(newTeam))

      res.redirect("/teams/" + newTeam._id);
    }
  });
});

router.get('/:id' , function(req, res){
  Team.findById(req.params.id, function(err, foundTeam){
    if(err){
        console.log("all teams find error: " + err);
    } else {
       res.render("teams/teams",{teams:foundTeam});
    }
 });
})


router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
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
