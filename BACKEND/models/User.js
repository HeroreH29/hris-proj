const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  branch: {
    type: String,
  },
  userGroup: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  userLevel: {
    type: String,
    default: "User",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
