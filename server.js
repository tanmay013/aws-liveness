require("dotenv").config();
const app = require("./app");

const portEnv = process.env.PORT;
const PORT =
  portEnv !== undefined && portEnv !== ""
    ? Number.parseInt(String(portEnv), 10)
    : 3000;

if (Number.isNaN(PORT) || PORT < 1) {
  console.error("[server] Invalid PORT:", portEnv);
  process.exit(1);
}

// Always bind all interfaces in containers (HOST=127.0.0.1 would block platform routing).
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`[server] Listening on http://${HOST}:${PORT} (PORT env: ${portEnv ?? "unset → 3000"})`);
  if (process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_ENVIRONMENT_NAME) {
    console.log(
      "[server] Railway: browser traffic needs a public URL — Service → Settings → Networking → Public networking → Generate domain. /health can be 200 from internal checks before that exists."
    );
  }
});
