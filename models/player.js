// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var playerSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  gender: String,
  team: String,
  avatar: {type: String, default: 'https://i.imgur.com/T1Fn4h5.png'},
  isAdmin: {type: Boolean, default: false},
  isCaptain: {type: Boolean, default: false},
});

playerSchema.plugin(passportLocalMongoose);

var Player = mongoose.model("Player", playerSchema);

module.exports = Player;
