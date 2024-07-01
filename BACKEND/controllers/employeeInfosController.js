const EmployeeInfo = require("../models/EmployeeInfo");

// CREATE
const createEmployeeInfo = async (req, res) => {
  const { EmployeeID, GenInfo, PersonalInfo } = req.body;
  try {
    const duplicateInfo = await EmployeeInfo.find({ EmployeeID: EmployeeID });

    if (duplicateInfo)
      return res.status(409).json({ message: "Employee already exists!" });

    const newEmployee = await EmployeeInfo.create({
      EmployeeID: EmployeeID,
      GenInfo: GenInfo,
      PersonalInfo: PersonalInfo,
    });

    if (newEmployee) res.json({ message: "Employee successfully added!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// READ
const getAllEmployeeInfos = async (req, res) => {
  const employeeInfos = await EmployeeInfo.find().lean();

  if (!employeeInfos.length) {
    return res.status(404).json({ message: "No employee informations found!" });
  }

  res.json(employeeInfos);
};

// UPDATE
const updateEmployeeInfo = async (req, res) => {
  const { id, ...others } = req.body;

  try {
    if (!id)
      return res.status(400).json({ message: "Employee id not provided!" });

    const updatedEmployee = await EmployeeInfo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedEmployee)
      res.json({ message: "Employee info successfully updated!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//DELETE

module.exports = {
  getAllEmployeeInfos,
  createEmployeeInfo,
  updateEmployeeInfo,
};
