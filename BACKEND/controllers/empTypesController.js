const EmpType = require("../models/EmpType");

// GET
const getAllEmpTypes = async (req, res) => {
  const empTypes = await EmpType.find().lean();

  if (!empTypes?.length)
    return res.status(400).json({ message: "EmpType data not found!" });

  res.json(empTypes);
};

module.exports = { getAllEmpTypes };
