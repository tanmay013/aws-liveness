require("dotenv").config();
const app = require("./app");

const PORT = Number(process.env.PORT) || 3000;
// Bind all interfaces so container platforms (Railway, Docker) can route health checks.
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`[server] Listening on http://${HOST}:${PORT}`);
});
