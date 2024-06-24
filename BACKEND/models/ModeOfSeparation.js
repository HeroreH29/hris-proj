const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modeOfSeparationSchema = new Schema({
  Mode_of_Separation: String,
});

module.exports = mongoose.model("ModeOfSeparation", modeOfSeparationSchema);
