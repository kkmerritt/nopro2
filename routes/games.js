var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Teams = require('../models/team');


//------[show all games]
router.get('/' ,
function(req, res){
Game.find({}, function(err, allGames){
if(err){console.log("all teams find error: " + err);}
else {
res.render("games/allgames",{games : allGames});
}
});
});

//------[new game creation form]
router.get('/new' ,
function(req, res){
Team.find({}, function(err, allTeams){
if(err){console.log("allTeams find error for NEW GAME rt: " + err);}
else {
res.render('games/newgame.ejs', {teams : allTeams});
}
});
});

//------[create new game]
router.post('/' ,
function(req, res){
console.log('on post route: here is req.body: ' + JSON.stringify(req.body))
var newGame = {
date: req.body.date,
field: req.body.field,
home: req.body.home,
away: req.body.away
}
Game.create(newGame,
function(err, newGame){
if(err){console.log('new game creation error: ' + err);}
else {
console.log("new game created and added to database :" + JSON.stringify(newGame))
res.redirect("games/" + newGame._id);
}
});
});

//------[show 1 game]
router.get('/:id' ,
function(req, res){
  console.log(req.params.id)
Game.findById(req.params.id, function(err, foundGame){

  //work work work
if(err){console.log("single game show page error: " + err);}

Team.findOne({name: foundGame.home}, function(err, foundHomeTeam){
if(err){console.log("err finding hometeam for game show page: " + err);}

Team.findOne({name: foundGame.away}, function(err, foundAwayTeam){
if(err){console.log("err finding awayteam for game show page: " + err);}
res.render("games/showgame" , {game : foundGame, home: foundHomeTeam, away:foundAwayTeam});
})
})
});
});

//------[show 1 game edit form]
router.get('/:id/edit',
function(req, res){
Game.findById(req.params.id,
function(err, foundGame){
if(err){console.log("error in the finding the game to edit: " + err);}
else {
Team.find({}, function(err, allTeams){
if(err){console.log("allTeams find error for EDIT GAME rt: " + err);}
else {
res.render('games/editgame.ejs', {teams : allTeams, game: foundGame});
}
});
}

});
});


//------[edit 1 game]
router.put('/:id',
function(req, res){
var editGame = {
date: req.body.date,
field: req.body.field,
home: req.body.home,
away: req.body.away,
homescore: req.body.homescore,
awayscore: req.body.awayscore
}
Game.findByIdAndUpdate(req.params.id, editGame,
function(err, foundGame){
if (err){console.log("error in updating a game: "+err);}
else {
console.log('this game has been updated: '+ foundGame)
res.redirect('/games/'+foundGame.id);
}
})
});

//------[delete game]
router.delete('/:id',
function(req, res){
Game.findByIdAndRemove(req.params.id,
function(err){
if (err){console.log("error with game deletion: "+err);}
else{
console.log('game has been deleted')
res.redirect('/games');
}
});
});

router.get('*', function(req,res){
res.redirect('/games');
console.log("hit the * route in games");
})
module.exports = router;
