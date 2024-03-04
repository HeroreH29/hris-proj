const uploadData = async (updateFunction, createFunction, parsedData) => {
  try {
    if (parsedData?.id) {
      await updateFunction(parsedData);
    } else {
      await createFunction(parsedData);
    }
  } catch (error) {
    console.error("Error uploading data:", error);
    // Handle error as needed
  }
};

export default uploadData;
