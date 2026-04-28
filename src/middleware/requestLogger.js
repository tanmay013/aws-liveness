const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    console.log(
      `[request] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
    );
  });

  next();
};

module.exports = {
  requestLogger
};
