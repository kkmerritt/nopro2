require('dotenv').config()
var express = require('express');
var server = express();               //'const'
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var middleware = require('./middleware');
var flash = require('connect-flash'); //express session sets up a lot of this already

//REMEMBER TO DEFINE THIS SHIT BEFORE ROUTES, moron
server.use(bodyParser.urlencoded({extended: true}));
server.use(methodOverride('_method'));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + "/public"))
server.use(flash());

LocalStrategy = require('passport-local');
Team = require('./models/team');
Player = require('./models/player');
Game = require('./models/game');


//passport config
server.use(session({
  secret:'jaxidingo',
  resave: false,
  saveUninitialized: false
}))

server.use(passport.initialize());
server.use(passport.session());
passport.use(new LocalStrategy(Player.authenticate()));
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());


server.use(function(req, res, next){
   res.locals.currentUser = req.user;
    // console.log('res.locals.currentUser: '+res.locals.currentUser)
    // console.log('req.user: '+req.user)
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
   next();
});


var teamRoutes = require('./routes/teams');
var playerRoutes = require('./routes/players');
var gameRoutes = require('./routes/games');

server.use("/teams",teamRoutes);
server.use("/players", playerRoutes);
server.use("/games",gameRoutes);


//-------<[ LOCAL DEVELOPMENT DATABASE ]
mongoose.connect("mongodb://localhost:27017/noprodb",
{ useUnifiedTopology: true, useNewUrlParser: true});
// -------<[ HEROKU/MONGO DEPLOYED DATABASE ]
// mongoose.connect(process.env.DATABASEURL,{ useUnifiedTopology: true, useNewUrlParser: true});
// app.use(bodyParser.urlencoded({extended: true}));


//display the basic home page no login required
server.get('/' , function(req, res){
  res.render('index.ejs');
});


server.post('/login',
passport.authenticate('local',
 { //this is being "used" in passport.use()
  successRedirect: '/',
  failureRedirect: '/signup'
}),
  function(req, res){
  // res.render('index.ejs'); //redirect back to '/' now logged in.
});


server.post('/register' , function(req, res){
  console.log('player creation info about to be entered: req.body:'+JSON.stringify(req.body));
  if (req.body.admincode === "admin") {req.body.isAdmin = true;}
  if (req.body.captaincode === "cap") {req.body.isCaptain = true;}
  if (req.body.gender === "Male") {req.body.image = 'https://i.imgur.com/lgMFKR7.png';}

  var newPlayer = {
    username: req.body.username, //user enters 'email'
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    image: req.body.image,
    team: req.body.team,
    isAdmin: req.body.isAdmin,
    isCaptain: req.body.isCaptain
  }

  Player.register(newPlayer, req.body.password, function(err, newPlayer){
    if(err){
      console.log('new player root creation error: ' + err);
      req.flash("error", err.message);
      res.redirect('/signup')
    } else {
      passport.authenticate('local')(req, res, function(){
        console.log("new player registered (logged in) and + database :" + JSON.stringify(newPlayer))
        req.flash("success", "New Player has been Created! Woot motherfuckin, WOOT");
        res.redirect("/");
      })
    }
  })
});

server.get('/signup' , function(req, res){
    Team.find({}, function(err, allTeams){
      if(err){
          console.log("all teams find error at signup route: " + err);
      } else {
        res.render('signup.ejs',{teams : allTeams} );
      }
  });
  })

  server.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
  });


server.set('port', (process.env.PORT || 3000));
server.listen(server.get('port'),
function(){console.log('server: running motherfuckers! port: ' + server.get('port'));});
