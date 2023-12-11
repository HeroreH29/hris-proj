const User = require("../models/User");
const bcrypt = require("bcrypt");

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
  } = req.body;

  // Confirm data
  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    !branch ||
    !employeeId ||
    !userLevel
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username already taken" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // Salt rounds

  const userObject = !userLevel
    ? {
        username,
        password: hashedPwd,
        firstName,
        lastName,
        branch,
        employeeId,
      }
    : {
        username,
        password: hashedPwd,
        firstName,
        lastName,
        branch,
        employeeId,
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
  const {
    id,
    username,
    password,
    firstName,
    lastName,
    branch,
    employeeId,
    userLevel,
    active,
  } = req.body;

  // Confirm data
  if (!id || !username || !userLevel) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

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

  user.username = username;
  user.firstName = firstName;
  user.lastName = lastName;
  user.branch = branch;
  u, (user.employeeId = employeeId);
  user.userLevel = userLevel;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
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
