const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outletSchema = new Schema({
  Code: {
    type: Number,
  },
  Outlet: {
    type: String,
  },
  Municipality: {
    type: String,
  },
  Reporting_Days: {
    type: Number,
  },
  Status: {
    type: String,
  },
  Breaktime_No: {
    type: Number,
  },
});

module.exports = mongoose.model("Outlet", outletSchema);
