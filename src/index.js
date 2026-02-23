const express = require("express");
const connectDB = require("./config/db");
const { startSchedulers } = require("./scheduler");
require("dotenv").config();

const app = express();

connectDB();
startSchedulers();

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("LeetCode Guardian Bot is Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
