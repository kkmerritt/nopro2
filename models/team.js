// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
   name: String,
   players: String,

  // image: String,

});

var Team = mongoose.model("Team", teamSchema);
module.exports = Team;
