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
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  userGroup: {
    type: String,
    required: true,
  },
  employeeId: {
    type: Object,
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
});

module.exports = mongoose.model("User", userSchema);
