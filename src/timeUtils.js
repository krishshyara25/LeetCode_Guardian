function getResetTime() {
  const now = new Date();

  // Convert current time to IST
  const nowIST = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const reset = new Date(nowIST);
  reset.setHours(5, 30, 0, 0);

  if (nowIST < reset) {
    reset.setDate(reset.getDate() - 1);
  }

  return reset;
}

function hasSubmittedToday(timestamp) {
  const submissionTime = new Date(timestamp * 1000);

  // Convert submission time to IST
  const submissionIST = new Date(
    submissionTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const resetTime = getResetTime();

  return submissionIST >= resetTime;
}

module.exports = { hasSubmittedToday };