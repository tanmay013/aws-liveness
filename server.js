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
});
