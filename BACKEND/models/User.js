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
  employee: {
    type: Schema.Types.ObjectId,
    ref: "EmployeeRecord",
  },
});

module.exports = mongoose.model("User", userSchema);
