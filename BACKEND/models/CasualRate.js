const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const casualRateSchema = new Schema({
  dailyRate: Number,
  ND: Number,
  ROT: Number,
  SOT: Number,
  ExSOT: Number,
  LHOT: Number,
  ExLHOT: Number,
  SHOT: Number,
  ExSHOT: Number,
  UT: Number,
});

module.exports = mongoose.model("CasualRate", casualRateSchema);
