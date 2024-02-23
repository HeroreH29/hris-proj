const os = require("os");

// Get the local IP address of the local machine/computer
const getLocalIpAddress = async (req, res) => {
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
    res.json(ipAddresses); // Send the array of IP addresses as JSON
  } else {
    res.status(500).json({ error: "No IPv4 addresses found" });
  }
};

module.exports = { getLocalIpAddress };
