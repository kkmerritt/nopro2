var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

//player index
// router.get('/' , function(req, res){
//   res.render('players/showplayer.ejs');
// });

//player new form
router.get('/new' , function(req, res){
  Team.find({}, function(err, allTeams){
    if(err){
        console.log("all teams find error: " + err);
    } else {
      res.render('players/newplayer.ejs',{teams : allTeams} );
    }
});
});

//player post creation
router.post('/' , function(req, res){
  console.log('player creation route accessed: req.body:'+JSON.stringify(req.body));
  var newPlayer = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    team: req.body.team
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
