// ================= LOAD ENV =================
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const { startSchedulers } = require("./scheduler");
const bot = require("./bot");

const app = express();

app.use(express.json());

connectDB();

startSchedulers();


// ================= HEALTH ROUTE =================
app.get("/", (req, res) => {
  res.status(200).send("LeetCode Guardian Bot is Running 🚀");
});


// ================= TELEGRAM WEBHOOK =================
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});


// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {

    const webhookURL =
      `https://leetcode-guardian.onrender.com/bot${process.env.TELEGRAM_BOT_TOKEN}`;

    await bot.setWebHook(webhookURL);

    console.log("Webhook set successfully 🚀");

  } catch (error) {
    console.error("Webhook setup error:", error);
  }
});