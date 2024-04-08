const CasualRate = require("../models/CasualRate");

// GET
const getAllCasualRates = async (req, res) => {
  const casualRates = await CasualRate.find().exec();

  if (!casualRates?.length) {
    console.error("Casual rates do not exist");
  }

  res.json(casualRates);
};

// UPDATE
const updateCasualRate = async (req, res) => {
  const { id, ...others } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Document id is required" });
  }

  await CasualRate.findByIdAndUpdate(id, others);

  res.json("Casual rates has been updated");
};

module.exports = { getAllCasualRates, updateCasualRate };
