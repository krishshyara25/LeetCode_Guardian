const axios = require("axios");

const LEETCODE_URL = "https://leetcode.com/graphql";


// ✅ 1️⃣ Validate username exists
async function validateLeetCodeUser(username) {
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
        }
      }
    `,
    variables: { username }
  };

  try {
    const response = await axios.post(
      LEETCODE_URL,
      query,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.data.matchedUser !== null;

  } catch (error) {
    console.error("LeetCode validation error:", error.message);
    return false;
  }
}


// ✅ 2️⃣ Get recent submissions (IMPORTANT FOR STREAK CHECK)
async function getRecentSubmissions(username) {
  const query = {
    query: `
      query recentSubmissions($username: String!) {
        recentSubmissionList(username: $username) {
          timestamp
          statusDisplay
          titleSlug
        }
      }
    `,
    variables: { username }
  };

  try {
    const response = await axios.post(
      LEETCODE_URL,
      query,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.data.recentSubmissionList || [];

  } catch (error) {
    console.error("LeetCode submission fetch error:", error.message);
    return [];
  }
}


async function getUpcomingContests() {
  const query = {
    query: `
      query {
        allContests {
          title
          startTime
          duration
        }
      }
    `
  };

  const res = await axios.post(
    "https://leetcode.com/graphql",
    query,
    { headers: { "Content-Type": "application/json" } }
  );

  const now = Math.floor(Date.now() / 1000);

  // Filter only upcoming contests
  return res.data.data.allContests.filter(
    contest => contest.startTime > now
  );
}



module.exports = {
  validateLeetCodeUser,
  getRecentSubmissions,
  getUpcomingContests
};
