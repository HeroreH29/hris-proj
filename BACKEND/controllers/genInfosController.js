const GenInfo = require("../models/GenInfo");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");
const { leaveCreditInclUpd } = require("../xtra_functions/leaveCreditInclUpd");
const {
  updateInactiveEmployees,
} = require("../xtra_functions/updateInactiveEmployees");

// @desc Get all geninfos
// @route GET /geninfos
// @access Private
// Includes leave credit inclusion and update, and automated employee regularization
const getAllGenInfo = async (req, res) => {
  const geninfos = await GenInfo.find().lean();

  if (!geninfos?.length) {
    return res.status(400).json({ message: "No general infos found" });
  }

  leaveCreditInclUpd(geninfos);
  updateInactiveEmployees(geninfos);

  res.json(geninfos);
};

// @desc Create new geninfo
// @route POST /geninfos
// @access Private
const createGenInfo = async (req, res) => {
  const {
    Prefix,
    MiddleName,
    DateLeaved,
    RegDate,
    DateProbationary,
    Notes,
    ATMnumber,
    ContractDateEnd,
    ...others
  } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every(
    (value) => value !== "" && value !== null
  );

  // Confirm data
  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicate = await GenInfo.findOne({ EmployeeID: others?.EmployeeID })
    .lean()
    .exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `EmployeeID ${others?.EmployeeID} already exists` });
  }

  const newEmployeeID = isStringAllNumbers(others?.EmployeeID);

  // Create and store new geninfo
  const newGenInfo = { ...req.body, MI: MiddleName ?? "" };
  const geninfo = await GenInfo.create(newGenInfo);

  if (geninfo) {
    res
      .status(201)
      .json({ message: `New general info with ${newEmployeeID} created` });
  } else {
    res.status(500).json({ message: "Invalid general info data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateGenInfo = async (req, res) => {
  const { id, EmployeeID, BioID, ...others } = req.body;

  const newEmployeeID = isStringAllNumbers(EmployeeID);

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Information 'id' is required" });
  }

  const geninfo = await GenInfo.findById(id).exec();

  if (!geninfo) {
    res.json({ message: "Information not found. Creating new record..." });

    const newGen = new GenInfo({
      _id: id,
      EmployeeID: EmployeeID,
      BioID: BioID,
      ...others,
    });
    newGen.save();
    res.json({ message: "General info has been added" });
  } else {
    // Check duplicate
    const duplicate = await GenInfo.exists({ EmployeeID: newEmployeeID });

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "EmployeeID already taken" });
    }

    const newGenInfo = await GenInfo.findByIdAndUpdate(id, others, {
      new: true,
    }).exec();

    if (geninfo?.EmployeeID !== newEmployeeID) {
      newGenInfo.EmployeeID = newEmployeeID;

      /* It is also required to update the EmployeeID
  of other information of the employee if EmployeeID is changed/modified */
      UpdateEmployeeID(geninfo?.EmployeeID, newEmployeeID);
    }

    const updatedGenInfo = await newGenInfo.save();

    if (updatedGenInfo) {
      res.json({ message: "General info has been updated" });
    }
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

module.exports = { getAllGenInfo, createGenInfo, updateGenInfo };
