require('dotenv').config()
var express = require('express');
var server = express();               //'const'
var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var middleware = require('./middleware');
var flash = require('connect-flash');

//REMEMBER TO DEFINE THIS SHIT BEFORE ROUTES, moron
server.use(bodyParser.urlencoded({extended: true}));
server.use(methodOverride('_method'));
server.set('view engine', 'ejs');
server.use(express.static(__dirname + "/public"))
//app.use(flash());

LocalStrategy = require('passport-local');
Team = require('./models/team');
Player = require('./models/player');


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
   next();
});


var teamRoutes = require('./routes/teams');
var playerRoutes = require('./routes/players');
server.use("/teams",teamRoutes);
server.use("/players", playerRoutes);


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
  console.log('player creation route [root] accessed: req.body:'+JSON.stringify(req.body));
  if (req.body.admincode === "admin") {req.body.isAdmin = true;}
  if (req.body.captaincode === "cap") {req.body.isCaptain = true;}
  if (req.body.gender === 'male') {req.body.avatar = 'https://i.imgur.com/lgMFKR7.png';}
  var newPlayer = {
    username: req.body.username, //using the var 'email'
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    team: req.body.team,
    isAdmin: req.body.isAdmin,
    isCaptain: req.body.isCaptain
  }
  console.log(JSON.stringify(newPlayer));

  Player.register(newPlayer, req.body.password, function(err, newPlayer){
    if(err){
      console.log('new player root creation error: ' + err);
      res.render('index.ejs')
    } else {
      passport.authenticate('local')(req, res, function(){
        console.log("new player created and registered (logged in) and added to database :" + JSON.stringify(newPlayer))
        res.redirect("/");
      })
    }
  })
});



server.get('/signup' , function(req, res){
    Team.find({}, function(err, allTeams){
      if(err){
          console.log("all teams find error at root: " + err);
      } else {
        res.render('signup.ejs',{teams : allTeams} );
      }
  });
  })

  //this should work,.maybe?
  server.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
  });


server.set('port', (process.env.PORT || 3000));
server.listen(server.get('port'),
function(){console.log('server: running motherfuckers! port: ' + server.get('port'));});
