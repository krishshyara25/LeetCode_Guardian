const cron = require("node-cron");
const User = require("./models/User");
const { getRecentSubmissions, getUpcomingContests } = require("./leetcode");
const { hasSubmittedToday } = require("./timeUtils");
const bot = require("./bot");

// 🔐 Prevent duplicate contest reminders
const sentContestReminders = new Set();

// ================= CONTEST REMINDER LOGIC =================
async function checkContestReminders() {
  try {
    const contests = await getUpcomingContests();
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    const oneDay = 86400;
    const twoHours = 7200;
    const oneHour = 3600;

    for (const contest of contests) {

      const startTime = contest.startTime;

      // Ignore past contests
      if (startTime < now) continue;

      const timeDiff = startTime - now;

      // Unique keys to prevent duplicates
      const key1 = contest.title + "_1day";
      const key2 = contest.title + "_2h";
      const key3 = contest.title + "_1h";

      // 📅 1 Day Reminder
      if (Math.abs(timeDiff - oneDay) < 300 && !sentContestReminders.has(key1)) {
        await bot.sendMessage(
          process.env.GROUP_CHAT_ID,
          `📅 Contest Tomorrow!\n\n🏆 ${contest.title}\n⏳ Starts in 24 hours!\n\nPrepare well 🚀`
        );
        sentContestReminders.add(key1);
      }

      // ⏳ 2 Hours Reminder
      if (Math.abs(timeDiff - twoHours) < 300 && !sentContestReminders.has(key2)) {
        await bot.sendMessage(
          process.env.GROUP_CHAT_ID,
          `⏳ Contest in 2 Hours!\n\n🏆 ${contest.title}\n\nStart revising now 💪`
        );
        sentContestReminders.add(key2);
      }

      // 🚨 1 Hour Reminder
      if (Math.abs(timeDiff - oneHour) < 300 && !sentContestReminders.has(key3)) {
        await bot.sendMessage(
          process.env.GROUP_CHAT_ID,
          `🚨 Contest in 1 Hour!\n\n🏆 ${contest.title}\n\nGet ready! 🔥`
        );
        sentContestReminders.add(key3);
      }
    }

  } catch (error) {
    console.error("Contest reminder error:", error);
  }
}


// ================= STREAK REMINDER LOGIC =================
async function checkUsers(timeLabel) {
  try {
    const users = await User.find();
    let warningUsers = [];

    for (const user of users) {

      const submissions = await getRecentSubmissions(user.leetcodeUsername);

      let solvedToday = false;

      for (const submission of submissions) {
        if (hasSubmittedToday(submission.timestamp)) {
          solvedToday = true;
          break;
        }
      }

      if (!solvedToday) {
        warningUsers.push(`• ${user.leetcodeUsername}`);
      }
    }

    if (warningUsers.length > 0) {
      const message =
`⚠️ Streak Warning (${timeLabel})

${warningUsers.join("\n")}

Solve before 5:30 AM IST! 💪`;

      await bot.sendMessage(process.env.GROUP_CHAT_ID, message);
    } else {
      console.log(`No warnings needed at ${timeLabel}`);
    }

  } catch (error) {
    console.error("Scheduler error:", error);
  }
}


// ================= START ALL SCHEDULERS =================
function startSchedulers() {

  // 🔔 Streak reminders
  const streakTimes = [
    { cron: "0 22 * * *", label: "10:00 PM" },
    { cron: "0 0 * * *", label: "12:00 AM" },
    { cron: "0 1 * * *", label: "1:00 AM" },
    { cron: "0 2 * * *", label: "2:00 AM" }
  ];

  streakTimes.forEach(time => {
    cron.schedule(time.cron, () => {
      console.log(`Running streak scheduler for ${time.label}`);
      checkUsers(time.label);
    }, { timezone: "Asia/Kolkata" });
  });

  // 🏆 Contest reminders every 10 minutes
  cron.schedule("*/10 * * * *", () => {
    console.log("Checking contest reminders...");
    checkContestReminders();
  }, { timezone: "Asia/Kolkata" });

  console.log("Schedulers started successfully 🚀");
}

module.exports = { startSchedulers };
