const TrainingHistory = require("../models/TrainingHistory");

// GET
const getAllTrainingHistories = async (req, res) => {
  const trainingHistories = await TrainingHistory.find();

  if (!trainingHistories.length) {
    return res.status(400).json({ message: "No training histories found" });
  }

  res.json(trainingHistories);
};

// POST
const createTrainingHistory = async (req, res) => {
  const { Remarks, ...others } = req.body;

  const othersHasValues = Object.values(others).every(
    (value) => value !== "" && value !== null
  );

  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newTrainingHist = await TrainingHistory.create(req.body);

  if (newTrainingHist) {
    res.status(201).json({ message: "Training history added!" });
  }
};

// PATCH
const updateTrainingHistory = async (req, res) => {
  const { id, _id } = req.body;

  if (!id || !_id) {
    return res.status(400).json({ message: "Document ID is missing!" });
  }

  const updatedTrainingHist = await TrainingHistory.findByIdAndUpdate(
    id ?? _id,
    req.body,
    {
      returnDocument: "after",
    }
  );

  try {
    if (updatedTrainingHist) {
      res.json({ message: "Training history updated!" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// DELETE
const deleteTrainingHistory = async (req, res) => {
  const { id, _id } = req.body;

  if (!id || !_id) {
    return res.status(400).json({ message: "Document ID is missing!" });
  }

  const deletedTrainingHistory = await TrainingHistory.findByIdAndDelete(
    id ?? _id
  );

  try {
    if (deletedTrainingHistory) {
      res.json({ message: "Training history deleted!" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = {
  getAllTrainingHistories,
  createTrainingHistory,
  updateTrainingHistory,
  deleteTrainingHistory,
};
