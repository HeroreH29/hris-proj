const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genInfoSchema = new Schema(
  {
    EmployeeID: {
      type: Object,
      required: true,
    },
    BioID: {
      type: Number,
      required: true,
    },
    Prefix: {
      type: String,
      default: "",
    },
    FirstName: {
      type: String,
      required: true,
    },
    MiddleName: {
      type: String,
      default: "",
    },
    MI: {
      type: String,
      default: "",
    },
    LastName: {
      type: String,
      required: true,
    },
    EmployeeType: {
      type: String,
      required: true,
    },
    AssignedOutlet: {
      type: String,
      required: true,
    },
    Department: {
      type: String,
      required: true,
    },
    JobTitle: {
      type: String,
      required: true,
    },
    DateEmployed: {
      type: String,
      required: true,
    },
    DateLeaved: {
      type: String,
      default: "",
    },
    RegDate: {
      type: String,
      default: "",
    },
    DateProbationary: {
      type: String,
      default: "",
    },
    EmpStatus: {
      type: String,
      required: true,
    },
    Notes: {
      type: String,
      default: "",
    },
    TINnumber: {
      type: String,
      required: true,
    },
    SSSnumber: {
      type: String,
      required: true,
    },
    PHnumber: {
      type: String,
      required: true,
    },
    PInumber: {
      type: String,
      required: true,
    },
    ATMnumber: {
      type: String,
      default: "",
    },
    ContractDateEnd: {
      type: String,
      default: "",
    },
  },
  { toJSON: { virtuals: true } } // added to include virtuals when passing to res.json()
);

genInfoSchema.virtual("FullName").get(function () {
  return `${this.LastName}, ${this.FirstName} ${this.MI}.`;
});

module.exports = mongoose.model("GenInfo", genInfoSchema);
