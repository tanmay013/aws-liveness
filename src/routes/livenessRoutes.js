const express = require("express");
const {
  createSessionHandler,
  getResultHandler,
  getHello
} = require("../controllers/livenessController");

const router = express.Router();

router.post("/create-session", createSessionHandler);
router.get("/get-result", getResultHandler);
router.get("/hello", getHello);

module.exports = router;
