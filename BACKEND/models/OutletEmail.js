const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const outletEmailSchema = new Schema({
  outletName: {
    type: String,
    required: true,
  },
  email: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("OutletEmail", outletEmailSchema);
