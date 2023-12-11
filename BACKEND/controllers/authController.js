const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginCookie = {
  httpOnly: true, // accessible only by web server
  secure: true, // https
  sameSite: "None", // cross-site cookie
  maxAge: 7 * 24 * 60 * 60 * 1000, // expiry set to match expiresIn of refreshToken variable
};

const logoutCookie = {
  httpOnly: true, // accessible only by web server
  secure: true, // https
  sameSite: "None", // cross-site cookie
};

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        userLevel: foundUser.userLevel,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, loginCookie);

  // Send accessToken containing username and user level
  res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - execute when access token has expired
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  // Verify the refreshToken if it matches to the secret refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ username: decoded.username });

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userame: foundUser.username,
            userLevel: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - clear cookies if exists
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", logoutCookie);
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
