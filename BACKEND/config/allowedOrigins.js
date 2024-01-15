const allowedDevelopmentOrigins = [
  "http://192.168.1.6:3000",
  "http://localhost:3000",
  undefined,
];

const allowedProductionOrigins = ["https://viamare-hris.onrender.com"];

module.exports = { allowedDevelopmentOrigins, allowedProductionOrigins };
