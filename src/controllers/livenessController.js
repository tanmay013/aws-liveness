const { createSession, getSessionResult } = require("../services/rekognitionService");
const { AppError } = require("../utils/errorHandler");
const { isValidSessionId } = require("../utils/validators");

const createSessionHandler = async (req, res, next) => {
  try {
    const result = await createSession();
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

const getResultHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.query;

    if (!isValidSessionId(sessionId)) {
      throw new AppError("Invalid or missing sessionId.", 400);
    }

    const result = await getSessionResult(sessionId);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getHello = async (req, res, next) => {
  try {
    return res.status(200).json({"result": "Hello World"});
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createSessionHandler,
  getResultHandler,
  getHello
};
