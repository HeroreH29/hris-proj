const Dep = require("../models/Dependent");
const stringSimilarity = require("string-similarity");

// @desc Get all deps
// @route GET /dependents
// @access Private
const getAllDependents = async (req, res) => {
  const deps = await Dep.find().lean();
  if (!deps?.length) {
    return res.status(400).json({ message: "No deps found" });
  }
  res.json(deps);
};

// @desc Create new dep
// @route POST /dependents
// @access Private
const createDependent = async (req, res) => {
  const {
    EmployeeID,
    Names,
    Dependent,
    Birthday,
    Status,
    Relationship,
    Covered,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID ||
    !Names ||
    !Dependent ||
    !Birthday ||
    !Status ||
    !Relationship ||
    !Covered
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicates = await Dep.find({ EmployeeID }).lean().exec();

  for (const dupli of duplicates) {
    const simValue = stringSimilarity.compareTwoStrings(dupli.Names, Names);

    if (simValue > 0.8) {
      return res
        .status(409)
        .json({ message: `Dependent ${Names} already exists: ${simValue}` });
    }
  }

  // Create and store new user
  const dep = await Dep.create({
    EmployeeID,
    Names,
    Dependent,
    Birthday,
    Status,
    Relationship,
    Covered,
  });

  if (dep) {
    res.status(201).json({ message: `New dependent: ${Names} created` });
  } else {
    res.status(500).json({ message: "Invalid dependent data received" });
  }
  /* if (duplicate) {
    const similarity = stringSimilarity.compareTwoStrings(
      duplicate.Names,
      Names
    );
    if (similarity > 0.8) {
      return res
        .status(409)
        .json({ message: `Dependent ${Names} already exists` });
    }
  } */

  // Create and store new user
  /* const dep = await Dep.create({
    EmployeeID,
    Names,
    Dependent,
    Birthday,
    Status,
    Relationship,
    Covered,
  });

  if (dep) {
    res.status(201).json({ message: `New dependent: ${Names} created` });
  } else {
    res.status(500).json({ message: "Invalid dependent data received" });
  } */
};

module.exports = { getAllDependents, createDependent };
