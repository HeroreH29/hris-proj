//const Dep = require("../models/Dependent");
const fs = require("node:fs/promises");

// @desc Get all documents
// @route GET /documents
// @access Private
const getDocument = async (req, res) => {
  const { document } = req.body;
  const docFilePath = `D:/GitHub/BACKEND/docs/${document}`;

  try {
    const pdfBuffer = await fs.readFile(docFilePath);
    const base64Doc = Buffer.from(pdfBuffer).toString("base64");
    res.json({ [document]: base64Doc });
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(404).json({ message: "File not found" }); // Handle specific error
    } else {
      res.status(500).json({ message: "Error reading file:", error: err }); // Handle other errors
    }
    return;
  }

  /* fs.readFile(docFilePath, (err, pdfBuffer) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.status(404).json({ message: "File not found" }); // Handle specific error
      } else {
        res.status(500).json({ message: "Error reading file:", error: err }); // Handle other errors
      }
      return;
    }

    const docuBlob = new Blob([pdfBuffer], { type: "application/pdf" });
    const pdfBase64String = Buffer.from(docuBlob).toString("base64");
    res.json({ pdf: pdfBase64String });
  }); */
};

// // @desc Create new dep
// // @route POST /dependents
// // @access Private
// const createDependent = async (req, res) => {
//   const {
//     EmployeeID,
//     Names,
//     Dependent,
//     Birthday,
//     Status,
//     Relationship,
//     Covered,
//   } = req.body;

//   // Confirm data
//   if (
//     !EmployeeID ||
//     !Names ||
//     !Dependent ||
//     !Birthday ||
//     !Status ||
//     !Relationship ||
//     !Covered
//   ) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // Will put duplicate checker if needed/necessary

//   // Create and store new user
//   const dep = await Dep.create({
//     EmployeeID,
//     Names,
//     Dependent,
//     Birthday,
//     Status,
//     Relationship,
//     Covered,
//   });

//   if (dep) {
//     res.status(201).json({ message: `New dependent: ${Names} created` });
//   } else {
//     res.status(500).json({ message: "Invalid dependent data received" });
//   }
// };

// // @desc Update dependent
// // @route PATCH /users
// // @access Private
// const updateDependent = async (req, res) => {
//   const { id, Names, Dependent, Birthday, Status, Relationship, Covered } =
//     req.body;

//   // Confirm data
//   if (!id) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const dependent = await Dep.findById(id).exec();

//   if (!dependent) {
//     return res.status(400).json({ message: "Dependent not found" });
//   }

//   /* // Check duplicate
//   const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();

//   // Allow updates to the original user
//   if (duplicate && duplicate?._id.toString() !== id) {
//     return res.status(409).json({ message: "EmployeeID already taken" });
//   } */

//   dependent.Names = Names;
//   dependent.Dependent = Dependent;
//   dependent.Birthday = Birthday;
//   dependent.Status = Status;
//   dependent.Relationship = Relationship;
//   dependent.Covered = Covered;

//   const updatedDependent = await dependent.save();

//   res.json({
//     message: `Dependent - ${updatedDependent.Names} - has been updated`,
//   });
// };

// // @desc Delete user
// // @route DELETE /users
// // @access Private
// const deleteDependent = async (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({ message: "Dependent ID required" });
//   }

//   // Check if user exists to delete
//   const dependent = await Dep.findById(id).exec();

//   if (!dependent) {
//     return res.status(400).json({ message: "Dependent not found" });
//   }

//   await dependent.deleteOne();

//   const reply = `Dependent: ${dependent.Names} is deleted`;

//   res.json(reply);
// };

module.exports = {
  getDocument,
};
