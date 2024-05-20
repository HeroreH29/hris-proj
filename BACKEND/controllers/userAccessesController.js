const UserAccess = require("../models/UserAccess");

// GET
const getAllUserAccess = async (req, res) => {
  const userAccess = await UserAccess.find();
  res.json(userAccess);
};

// PATCH
const updateUserAccess = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Document ID is missing" });
  }

  const updatedUserAccess = await UserAccess.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
  });

  try {
    if (updatedUserAccess) {
      res.json({ message: "User access updated!" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = { getAllUserAccess, updateUserAccess };
