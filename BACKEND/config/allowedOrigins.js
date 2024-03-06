const os = require("os");

const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  const ipAddresses = [];

  for (const interfaceName in interfaces) {
    const interfaceArray = interfaces[interfaceName];
    for (const iface of interfaceArray) {
      if (!iface.internal && iface.family === "IPv4") {
        ipAddresses.push(iface.address);
      }
    }
  }

  if (ipAddresses.length > 0) {
    return ipAddresses[0]; // Send the array of IP addresses as JSON
  } else {
    throw new Error("There are no IP addresses found!");
  }
};

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3500",
  `http://${getLocalIpAddress()}:3000`,
  `http://${getLocalIpAddress()}:3500`,
];

module.exports = { allowedOrigins };
