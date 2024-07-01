import { format } from "date-fns";

const DateFormatter = (dateString = "", dateFormat = "yyyy-MM-dd") => {
  return dateString ? format(new Date(dateString), dateFormat) : "";
};

export default DateFormatter;
