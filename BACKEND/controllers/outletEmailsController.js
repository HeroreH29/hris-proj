const OutletEmail = require("../models/OutletEmail");

// GET
const getAllOutletEmails = async (req, res) => {
  const outletEmails = await OutletEmail.find();

  if (!outletEmails?.length) {
    return res.status(400), json({ message: "No outlet emails found" });
  }

  res.json(outletEmails);
};

module.exports = { getAllOutletEmails };
