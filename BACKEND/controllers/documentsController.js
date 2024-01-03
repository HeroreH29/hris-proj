const Doc = require("../models/Document");
// const fs = require("node:fs/promises");

// @desc Get all documents
// @route GET /documents
// @access Private
const getDocuments = async (req, res) => {
  const docs = await Doc.find().lean();
  if (!docs?.length) {
    return res.status(400).json({ message: "No docs found" });
  }
  res.json(docs);
};

module.exports = {
  getDocuments,
};
