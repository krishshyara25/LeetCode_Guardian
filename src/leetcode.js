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

module.exports = {
  validateLeetCodeUser,
  getRecentSubmissions
};
