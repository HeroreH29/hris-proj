const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  mime: {
    type: String,
    default: "application/pdf",
  },
  data: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Document", documentSchema);
