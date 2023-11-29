const Announcement = require("../models/Announcement");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all announcements
// @route GET /announcements
// @access Private
const getAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().lean();
  if (!announcements?.length) {
    return res.status(400).json({ message: "No announcements found" });
  }

  res.json(announcements);
});

// @desc Create announcement
// @route POST /announcements
// @access Private
const createAnnouncement = asyncHandler(async (req, res) => {
  const { user, title, date, message, expiryDate } = req.body;

  // Confirm data
  if (!user || !title || !date || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Announcement.findOne({ title }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Announcement title already exists" });
  }

  // Create and store new announcement
  const announcement = await Announcement.create({
    user,
    title,
    date,
    message,
    expiryDate,
  });

  if (announcement) {
    return res
      .status(201)
      .json({ message: `Announcement ${title} is created` });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid announcement data received" });
  }
});

// @desc Update announcement
// @route PATCH /announcements
// @access Private
const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id, user, title, message, active } = req.body;

  // Confirm data
  if (!id || !user || !title || !message || typeof active !== "boolean") {
    return res.status(400).json({ messsage: "All fields are required" });
  }

  // Confirm announcement exist to update
  const announcement = await Announcement.findById(id).exec();

  if (!announcement) {
    return res.status(400).json({ messsage: "Announcement not found" });
  }

  // Check for duplicate title
  const duplicate = await Announcement.findOne({ title }).lean();

  // Allow renaming original title if not same as others
  if (duplicate && String(duplicate._id) !== String(id)) {
    return res
      .status(409)
      .json({ messsage: "Announcement title already exists" });
  }

  announcement.user = user;
  announcement.title = title;
  announcement.message = message;
  announcement.active = active;

  const updatedAnnouncement = await announcement.save();

  res.json(`${updatedAnnouncement.title} has been updated`);
});

// @desc Delete announcement
// @route DELETE /announcements
// @access Private
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Announcement ID required" });
  }

  // Confirm announcement exists to delete
  const announcement = await Announcement.findById(id).exec();

  if (!announcement) {
    return res.status(400).json({ message: "Announcement not found" });
  }

  const result = await announcement.deleteOne();

  const reply = `Announcement '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
