const cron = require("node-cron");
const User = require("./models/User");
const { getRecentSubmissions } = require("./leetcode");
const { hasSubmittedToday } = require("./timeUtils");
const bot = require("./bot");

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
        warningUsers.push(`${user.leetcodeUsername}`);
      }
    }

    if (warningUsers.length > 0) {
      const message =
        `⚠️ Streak Warning (${timeLabel})

${warningUsers.join("\n")}

Solve before 5:30 AM IST!`;

      await bot.sendMessage(process.env.GROUP_CHAT_ID, message);
    } else {
      console.log(`No warnings needed at ${timeLabel}`);
    }

  } catch (error) {
    console.error("Scheduler error:", error);
  }
}

function startSchedulers() {

  const times = [
    // { cron: "* * * * *", label: "3:12 PM" },
    { cron: "0 22 * * *", label: "10:00 PM" },
    { cron: "0 0 * * *", label: "12:00 AM" },
    { cron: "0 1 * * *", label: "1:00 AM" },
    { cron: "0 2 * * *", label: "2:00 AM" }
  ];

  times.forEach(time => {
    cron.schedule(time.cron, () => {
      console.log(`Running scheduler for ${time.label}`);
      checkUsers(time.label);
    }, { timezone: "Asia/Kolkata" });
  });

  console.log("Schedulers started successfully 🚀");
}

module.exports = { startSchedulers };
