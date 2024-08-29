const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const schoolRouter = require("./routes/schoolRoutes");
const dotenv = require("dotenv");

const app = express();

app.use(bodyParser.json());

app.use("/", schoolRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong!");
});

db.connect((err) => {
  if (err) {
    console.log("Error in DB connection /n" + err);
  } else {
    console.log("DB connected succesfully");
  }
});

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
