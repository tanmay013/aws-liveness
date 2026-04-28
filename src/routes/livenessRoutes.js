const express = require("express");
const {
  createSessionHandler,
  getResultHandler
} = require("../controllers/livenessController");

const router = express.Router();

router.post("/create-session", createSessionHandler);
router.get("/get-result", getResultHandler);

module.exports = router;
