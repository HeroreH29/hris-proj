const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const announcementSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Uncomment if ever needed
/* announcementSchema.plugin(AutoIncrement, {
  inc_field: "id",
}); */

module.exports = mongoose.model("Announcement", announcementSchema);
