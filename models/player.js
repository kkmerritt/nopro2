// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var playerSchema = new mongoose.Schema({
  email: String,
  firstname: String,
  lastname: String,
  team: String,
  avatar: String,
  isAdmin: {type: Boolean, default: false},
  isCaptain: {type: Boolean, default: false},
});

var Player = mongoose.model("Player", playerSchema);

module.exports = Player;
