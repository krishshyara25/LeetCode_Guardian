function getResetTime() {
  const now = new Date();
  const reset = new Date();

  reset.setHours(5, 30, 0, 0);

  if (now < reset) {
    reset.setDate(reset.getDate() - 1);
  }

  return reset;
}

function hasSubmittedToday(timestamp) {
  const submissionTime = new Date(timestamp * 1000);
  const resetTime = getResetTime();
  return submissionTime >= resetTime;
}

module.exports = { hasSubmittedToday };
