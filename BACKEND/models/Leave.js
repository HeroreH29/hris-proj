const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
  DateFiled: {
    type: String,
    required: true,
  },
  NoOfDays: {
    type: Number,
    required: true,
  },
  DayTime: {
    type: String,
    default: "",
  },
  Ltype: {
    type: String,
    required: true,
  },
  Lfrom: {
    type: String,
    required: true,
  },
  Lto: {
    type: String,
    default: "",
  },
  Reason: {
    type: String,
    default: "",
  },
  Remarks: {
    type: String,
    default: "",
  },
  Approve: {
    type: Number,
    default: 0,
  },
  FiledBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ModifiedDate: {
    type: String,
    default: "",
  },
  Employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
  Credited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
