const isValidSessionId = (sessionId) => {
  if (typeof sessionId !== "string") {
    return false;
  }

  const value = sessionId.trim();

  if (!value) {
    return false;
  }

  return /^[A-Za-z0-9-]{10,128}$/.test(value);
};

module.exports = {
  isValidSessionId
};
