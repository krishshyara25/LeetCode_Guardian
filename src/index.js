require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { startSchedulers } = require("./scheduler");
require("./bot");

const app = express();

connectDB();
startSchedulers();

app.listen(3000, () => {
  console.log("Server running...");
});
