const Outlet = require("../models/Outlet");

// GET
const getAllOutlets = async (req, res) => {
  const outlets = await Outlet.find().lean();

  if (!outlets?.length) {
    return res.status(400).json({ message: "Outlets data not found!" });
  }

  res.json(outlets);
};

module.exports = { getAllOutlets };
