const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema(
  {
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
      type: String,
      default: "",
    },
    FiledFor: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeRecord",
    },
    ModifiedDate: {
      type: String,
      default: "",
    },
    Credited: {
      type: Boolean,
      default: false,
    },
    Credits: {
      type: Schema.Types.ObjectId,
      ref: "LeaveCredit",
    },
  },
  { toJSON: { virtuals: true } }
);

leaveSchema.virtual("StartingYear").get(function () {
  return new Date(this.DateFiled).getFullYear();
});

module.exports = mongoose.model("Leave", leaveSchema);
