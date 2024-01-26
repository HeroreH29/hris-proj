const {
  allowedDevelopmentOrigins,
  allowedProductionOrigins,
} = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    // '!origin' is included for postman testing
    const allowedOrigins =
      process.env.NODE_ENV === "development"
        ? allowedDevelopmentOrigins
        : allowedProductionOrigins;

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
