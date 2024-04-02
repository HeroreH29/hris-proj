const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const announcementSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
