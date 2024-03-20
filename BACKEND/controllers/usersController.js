const User = require("../models/User");
const bcrypt = require("bcrypt");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    branch,
    employeeId,
    userLevel,
    userGroup,
  } = req.body;

  // Confirm data
  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    !branch ||
    !employeeId ||
    !userLevel ||
    !userGroup
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates (same username lowercase or uppercase is considered)
  const duplicate = await User.findOne({ employeeId })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "User account with Employee ID already exist" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // Salt rounds

  const newEmployeeID = isStringAllNumbers(employeeId);

  const userObject = !userLevel
    ? {
        username,
        password: hashedPwd,
        firstName,
        lastName,
        branch,
        userGroup,
        employeeId: newEmployeeID,
      }
    : {
        username,
        password: hashedPwd,
        firstName,
        lastName,
        branch,
        userGroup,
        employeeId: newEmployeeID,
        userLevel,
      };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(500).json({ message: "Invalid user data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, password, userLevel, userGroup } = req.body;

  // Confirm data
  if (!id || !username || !userLevel || !userGroup) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Username already taken" });
  }

  // For changing password
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  user = req.body;

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
