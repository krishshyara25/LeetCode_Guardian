const TelegramBot = require("node-telegram-bot-api");
const User = require("./models/User");
const {
  validateLeetCodeUser,
  getRecentSubmissions,
  getUpcomingContests
} = require("./leetcode");
const { hasSubmittedToday } = require("./timeUtils");

const isProduction = process.env.NODE_ENV === "production";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});


// ================= MENU FUNCTION =================
function showMenu(chatId) {
  bot.sendMessage(chatId, "📌 Choose an option:", {
    reply_markup: {
      keyboard: [
        ["📊 Status", "🏆 Leaderboard"],
        ["📋 List Users", "📅 Upcoming Contests"],
        ["🗑️ Unregister", "ℹ️ Help"]
      ],
      resize_keyboard: true
    }
  });
}


// ================= START COMMAND =================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
👋 Welcome to LeetCode Streak Guardian Bot!

Track your streak.
Compete with friends.
Never miss a contest.

Use the menu below to get started 🚀
  `);

  showMenu(chatId);
});


// ================= HELP =================
bot.onText(/\/help/, (msg) => {
  showMenu(msg.chat.id);
});


// ================= MOTIVATION =================
function getMotivationMessage() {
  const messages = [
    "Consistency beats intensity 💪",
    "Small progress daily = Big success 📈",
    "Don’t break the chain 🔥",
    "You’re one problem away from greatness 🚀",
    "Stay disciplined, not motivated 💯"
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}


// ================= REGISTER =================
bot.onText(/\/register (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const telegramUsername = msg.from.username || "unknown";
  const leetcodeUsername = match[1].trim();

  try {
    const isValid = await validateLeetCodeUser(leetcodeUsername);

    if (!isValid) {
      return bot.sendMessage(chatId,
        `❌ LeetCode username "${leetcodeUsername}" does not exist.`);
    }

    const existing = await User.findOne({ leetcodeUsername });

    if (existing) {
      return bot.sendMessage(chatId,
        `⚠️ "${leetcodeUsername}" is already registered.`);
    }

    await User.create({
      telegramId,
      telegramUsername,
      leetcodeUsername
    });

    bot.sendMessage(chatId,
      `✅ Registered successfully: ${leetcodeUsername}`);

    showMenu(chatId);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "❌ Registration failed.");
  }
});


// ================= STATUS =================
async function handleStatus(msg) {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  const user = await User.findOne({ telegramId });

  if (!user) {
    return bot.sendMessage(chatId, "❌ You are not registered.");
  }

  const submissions = await getRecentSubmissions(user.leetcodeUsername);

  let solvedToday = false;

  for (const submission of submissions) {
    if (
      submission.statusDisplay === "Accepted" &&
      hasSubmittedToday(submission.timestamp)
    ) {
      solvedToday = true;
      break;
    }
  }

  bot.sendMessage(chatId, `
📊 Status for ${user.leetcodeUsername}

Solved Today: ${solvedToday ? "✅ Yes" : "❌ No"}

${getMotivationMessage()}
  `);

  showMenu(chatId);
}


// ================= UNREGISTER =================
async function handleUnregister(msg) {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;

  const user = await User.findOneAndDelete({ telegramId });

  if (!user) {
    return bot.sendMessage(chatId, "❌ You are not registered.");
  }

  bot.sendMessage(chatId, "🗑️ You have been removed successfully.");

  showMenu(chatId);
}


// ================= LIST USERS =================
async function handleList(msg) {
  const chatId = msg.chat.id;

  const users = await User.find();

  if (users.length === 0) {
    return bot.sendMessage(chatId, "No registered users.");
  }

  const list = users.map(u => `• ${u.leetcodeUsername}`).join("\n");

  bot.sendMessage(chatId, `
📋 Registered Users:

${list}
  `);

  showMenu(chatId);
}


// ================= LEADERBOARD =================
async function handleLeaderboard(msg) {
  const chatId = msg.chat.id;

  const users = await User.find();

  let leaderboard = [];

  for (const user of users) {
    const submissions = await getRecentSubmissions(user.leetcodeUsername);

    let solvedProblems = new Set();

    for (const submission of submissions) {
      if (
        submission.statusDisplay === "Accepted" &&
        hasSubmittedToday(submission.timestamp)
      ) {
        solvedProblems.add(submission.titleSlug);
      }
    }

    leaderboard.push({
      username: user.leetcodeUsername,
      solved: solvedProblems.size
    });
  }

  leaderboard.sort((a, b) => b.solved - a.solved);

  const message = leaderboard.map((u, index) =>
    `${index + 1}. ${u.username} — ${u.solved} solved`
  ).join("\n");

  bot.sendMessage(chatId, `
🏆 Today's Leaderboard:

${message}
  `);

  showMenu(chatId);
}


// ================= UPCOMING CONTESTS =================
async function handleUpcomingContests(msg) {
  const chatId = msg.chat.id;

  try {
    const contests = await getUpcomingContests();

    if (!contests.length) {
      return bot.sendMessage(chatId, "No upcoming contests found.");
    }

    let message = "📅 Upcoming Contests:\n\n";

    contests.slice(0, 5).forEach(contest => {
      const date = new Date(contest.startTime * 1000);

      const istDate = date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
      });

      message += `🏆 ${contest.title}\n🕒 ${istDate} IST\n\n`;
    });

    bot.sendMessage(chatId, message);

  } catch (error) {
    console.error("Contest fetch error:", error);
    bot.sendMessage(chatId, "❌ Failed to fetch contests.");
  }

  showMenu(chatId);
}


// ================= BUTTON HANDLER =================
bot.on("message", async (msg) => {
  const text = msg.text;
  if (!text) return;

  if (text === "📊 Status") return handleStatus(msg);
  if (text === "🏆 Leaderboard") return handleLeaderboard(msg);
  if (text === "📋 List Users") return handleList(msg);
  if (text === "📅 Upcoming Contests") return handleUpcomingContests(msg);
  if (text === "🗑️ Unregister") return handleUnregister(msg);
  if (text === "ℹ️ Help") return showMenu(msg.chat.id);

  // Auto-show menu for private chat if unknown message
  if (msg.chat.type === "private") {
    showMenu(msg.chat.id);
  }
});


module.exports = bot;
