const Announcement = require("../models/Announcement");

// Auto deletes expired announcements
const deleteExpiredAnnouncements = async (announcement) => {
  const expiryDate = new Date(announcement?.expiryDate).valueOf();
  const currentDate = new Date().valueOf();

  if (currentDate >= expiryDate) {
    const expiredAnnouncement = await Announcement.findById(
      announcement?._id
    ).exec();

    if (!expiredAnnouncement) {
      console.log("No expired announcements found");
    } else {
      await expiredAnnouncement.deleteOne();
    }
  }
};

module.exports = { deleteExpiredAnnouncements };
