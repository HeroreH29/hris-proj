const allowedDevelopmentOrigins = [
  "http://192.168.1.6:3000",
  "http://192.168.1.6:3500",
  undefined,
];

const allowedProductionOrigins = ["http://192.168.1.6:3000"];

module.exports = { allowedDevelopmentOrigins, allowedProductionOrigins };
