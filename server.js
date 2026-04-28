require("dotenv").config();
const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`[server] Received ${signal}. Shutting down gracefully.`);
  server.close(() => {
    console.log("[server] HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
