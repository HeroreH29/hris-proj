const uploadData = async (
  updateFunction,
  createFunction,
  parsedData,
  navigate,
  toast
) => {
  try {
    let res;
    if (parsedData?.id) {
      res = await updateFunction(parsedData);
    } else {
      res = await createFunction(parsedData);
    }

    if (res) {
      navigate("/employeerecords");
      toast.success("Record saved!");
    }
  } catch (error) {
    toast.error("Error uploading data:", error);
  }
};

export default uploadData;
