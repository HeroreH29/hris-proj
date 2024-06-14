const PersonalInfo = require("../models/PersonalInfo");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");

// @desc Get all users
// @route GET /users
// @access Private
const getAllPersonalInfo = async (req, res) => {
  const personalInfos = await PersonalInfo.find().lean();
  if (!personalInfos?.length) {
    return res.status(400).json({ message: "No personal infos found" });
  }
  res.json(personalInfos);
};

// @desc Create new personalinfo
// @route POST /personalinfos
// @access Private
const createPersonalInfo = async (req, res) => {
  const {
    EmployeeID,
    Birthday,
    PermanentAddress,
    PresentAddress,
    ZipCode,
    Email,
    Gender,
    CivilStatus,
    Height,
    Weight,
    Phone,
    Mobile,
    Spouse,
    FatherName,
    Foccupation,
    MotherName,
    Moccupation,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID ||
    !Birthday ||
    !PermanentAddress ||
    !PresentAddress ||
    !ZipCode ||
    !Gender ||
    !CivilStatus ||
    !Height ||
    !Weight
  ) {
    return res
      .status(400)
      .json({ message: "Personal Info: All fields are required" });
  }

  // Check duplicates
  const duplicate = await PersonalInfo.findOne({ EmployeeID }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `EmployeeID ${EmployeeID} already exists` });
  }

  const newEmployeeID = isStringAllNumbers(EmployeeID);

  // Create and store new personalinfo
  const personalinfo = await PersonalInfo.create({
    EmployeeID: newEmployeeID,
    Birthday,
    PresentAddress,
    PermanentAddress,
    ZipCode,
    Email,
    Gender,
    CivilStatus,
    Height,
    Weight,
    Phone,
    Mobile,
    Spouse,
    FatherName,
    Foccupation,
    MotherName,
    Moccupation,
  });

  if (personalinfo) {
    res
      .status(201)
      .json({ message: `New personal info with ${EmployeeID} created` });
  } else {
    res.status(500).json({ message: "Invalid personal info data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updatePersonalInfo = async (req, res) => {
  const { id, EmployeeID, ...others } = req.body;

  // Confirm data
  if (!id || !EmployeeID) {
    return res.status(400).json({ message: "id and EmployeeID is required" });
  }

  const personalinfo = await PersonalInfo.findById(id).exec();

  if (!personalinfo) {
    res.json({ message: "Personal info not found. Creating new record..." });

    const newPers = new PersonalInfo({
      _id: id,
      EmployeeID: EmployeeID,
      ...others,
    });
    newPers.save();
    res.json({ message: "Personal info has been added" });
  } else {
    Object.assign(personalinfo, others);
    personalinfo.overwrite(req.body);
    personalinfo.save();
    res.json({ message: "Personal info has been updated" });
  }
};

// @desc Delete user
// @route DELETE /users
// @access Private
// const deleteUser = async (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({ message: "User ID required" });
//   }

//   // Check if user exists to delete
//   const user = await User.findById(id).exec();

//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   if (user.active) {
//     return res.status(400).json({
//       message: "User is still active. Deactivate user before deleting.",
//     });
//   }

//   const result = await user.deleteOne();

//   const reply = `Username ${user.username} with ID ${user._id} is deleted`;

//   res.json(reply);
// };

module.exports = { getAllPersonalInfo, createPersonalInfo, updatePersonalInfo };
