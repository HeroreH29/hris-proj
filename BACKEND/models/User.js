const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userGroup: {
    type: String,
    required: true,
  },
  userLevel: {
    type: String,
    default: "User",
  },
  active: {
    type: Boolean,
    default: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  employeeId: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
