const { allowedOrigins } = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman or curl) in development mode
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
