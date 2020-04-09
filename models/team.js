// -------<[ SCHEMA ]>------->
var mongoose = require("mongoose");

var teamSchema = new mongoose.Schema({
   name: String,
   captain: String,
   phone: String,
   players: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Player"
      }
   ]

  // image: String,

});

var Team = mongoose.model("Team", teamSchema);
module.exports = Team;
