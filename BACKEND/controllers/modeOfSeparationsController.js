const ModeOfSeparation = require("../models/ModeOfSeparation");

// GET
const getAllModeOfSeparations = async (req, res) => {
  const modeOfSeparations = await ModeOfSeparation.find().lean();

  if (!modeOfSeparations?.length)
    return res
      .status(400)
      .json({ message: "ModeOfSeparation data not found!" });

  res.json(modeOfSeparations);
};

module.exports = { getAllModeOfSeparations };
