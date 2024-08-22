const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./config/db");
require("dotenv").config();
const { response } = require("./utils/response");
const studentRouter = require("./routes/student");
const teacherRouter = require("./routes/teacher");
const marksRouter = require("./routes/marks");

const app = express();

app.use(express.json());
app.use(cors());

app.use(`${process.env.APP_VERSION}/students`, studentRouter);
app.use(`${process.env.APP_VERSION}/teachers`, teacherRouter);
app.use(`${process.env.APP_VERSION}/marks`, marksRouter);

app.use((req, res) => {
  response(res, 404, 0, "Page not found!!!", null, null);
});

connectToMongoDB(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
