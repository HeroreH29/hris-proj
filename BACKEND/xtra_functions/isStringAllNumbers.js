// Extra checking if EmployeeID are all numbers or not
const isStringAllNumbers = (EmployeeID) => {
  // EmployeeID are all numbers
  const isANumber = !isNaN(Number(EmployeeID));
  if (isANumber) {
    return EmployeeID * 1;
  }

  // Return unchanged if not
  return EmployeeID;
};

module.exports = { isStringAllNumbers };
