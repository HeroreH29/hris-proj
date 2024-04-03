const User = require("../models/User");
const GenInfo = require("../models/GenInfo");
const bcrypt = require("bcrypt");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find()
    .populate("employee")
    .select("-password")
    .lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, userLevel, userGroup } = req.body;

  // Confirm data
  if (!username || !password || !userLevel || !userGroup) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates (same id)
  const duplicate = await User.find({ employee: req.body.employee }).exec();
  if (duplicate.length) {
    return res
      .status(409)
      .json({ message: "User account with selected employee already exist" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // Salt rounds

  const userObject = {
    ...req.body,
    password: hashedPwd,
  };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `User account created` });
  } else {
    res.status(500).json({ message: "Invalid user data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, ...others } = req.body;

  const othersHasValues = Object.values(others).every(
    (value) => value || value !== null
  );

  // Confirm data
  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicate
  const duplicate = await User.findOne({ username: others.username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow username updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already taken" });
  }

  const user = await User.findByIdAndUpdate(id, others, {
    new: true,
  }).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // For changing password
  if (others.password) {
    // Hash password
    user.password = await bcrypt.hash(others.password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `User ${updatedUser.username} updated` });
};

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id, active } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  // Check if user exists to delete
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (active) {
    return res.status(400).json({
      message: "User is still active. Deactivate user before deleting.",
    });
  }

  const result = await user.deleteOne();

  const reply = `Username "${result.username}" with ID "${result._id}" is deleted`;

  res.json(reply);
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
