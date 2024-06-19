require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/announcements", require("./routes/announcementRoutes"));
app.use("/attendances", require("./routes/attendanceRoutes"));
app.use("/geninfos", require("./routes/genInfoRoutes"));
app.use("/personalinfos", require("./routes/personalInfoRoutes"));
app.use("/dependents", require("./routes/dependentRoutes"));
app.use("/workinfos", require("./routes/workInfoRoutes"));
app.use("/educinfos", require("./routes/educInfoRoutes"));
app.use("/documents", require("./routes/documentRoutes"));
app.use("/leaves", require("./routes/leaveRoutes"));
app.use("/leavecredits", require("./routes/leaveCreditRoutes"));
app.use("/inactiveemps", require("./routes/inactiveEmpRoutes"));
app.use("/emailsender", require("./routes/emailSenderRoutes"));
app.use("/celebrants", require("./routes/celebrantRoutes"));
app.use("/casualrates", require("./routes/casualRateRoutes"));
app.use("/traininghistories", require("./routes/trainingHistoryRoutes"));
app.use("/useraccess", require("./routes/userAccessRoutes"));
app.use("/outletemails", require("./routes/outletEmailRoutes"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
