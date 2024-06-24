const Department = require("../models/Department");

// GET
const getAllDepartments = async (req, res) => {
  const departments = await Department.find().lean();

  if (!departments?.length)
    return res.status(400).json({ message: "Department data not found!" });

  res.json(departments);
};

module.exports = { getAllDepartments };
