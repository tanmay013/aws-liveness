const {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand
} = require("@aws-sdk/client-rekognition");

const { AppError } = require("../utils/errorHandler");

const region = process.env.AWS_REGION || "ap-south-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const isPlaceholderCredential = (value) => {
  if (!value) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "xxx" || normalized === "your_access_key" || normalized === "your_secret_key";
};

const hasStaticCredentials = Boolean(accessKeyId && secretAccessKey);
const hasInvalidStaticCredentials =
  isPlaceholderCredential(accessKeyId) || isPlaceholderCredential(secretAccessKey);

const clientConfig = { region };

if (hasStaticCredentials) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey
  };
}

const rekognitionClient = new RekognitionClient(clientConfig);

const mapAwsError = (error, defaultMessage) => {
  const errorByName = {
    AccessDeniedException: "Access denied while calling AWS Rekognition.",
    UnrecognizedClientException: "Invalid AWS credentials. Please check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.",
    InvalidSignatureException: "AWS request signature is invalid. Check credentials and system time.",
    ExpiredTokenException: "AWS credentials are expired. Please rotate credentials.",
    InvalidParameterException: "Invalid request provided to AWS Rekognition.",
    ProvisionedThroughputExceededException: "AWS Rekognition rate limit reached. Please retry.",
    ThrottlingException: "Request throttled by AWS Rekognition. Please retry.",
    ValidationException: "Validation failed for Rekognition request.",
    ResourceNotFoundException: "Requested Rekognition resource was not found."
  };

  const message = errorByName[error.name] || defaultMessage;
  const statusCode =
    error.$metadata?.httpStatusCode && error.$metadata.httpStatusCode >= 400
      ? error.$metadata.httpStatusCode
      : 502;

  return new AppError(message, statusCode);
};

const encodeImageData = (image) => {
  if (!image) {
    return null;
  }

  if (image.S3Object?.Name) {
    const bucket = image.S3Object.Bucket || "";
    return bucket ? `s3://${bucket}/${image.S3Object.Name}` : image.S3Object.Name;
  }

  if (image.Bytes) {
    return Buffer.from(image.Bytes).toString("base64");
  }

  return null;
};

const createSession = async () => {
  try {
    if (hasInvalidStaticCredentials) {
      throw new AppError(
        "AWS credentials are placeholders. Update AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.",
        500
      );
    }

    const command = new CreateFaceLivenessSessionCommand({
      Settings: {
        ChallengePreferences: [
          { Type: "FaceMovementChallenge" },
        ],
      }
    });
    const response = await rekognitionClient.send(command);
    return {
      sessionId: response.SessionId
    };
  } catch (error) {
    throw mapAwsError(error, "Failed to create face liveness session.");
  }
};

const getSessionResult = async (sessionId) => {
  try {
    if (hasInvalidStaticCredentials) {
      throw new AppError(
        "AWS credentials are placeholders. Update AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.",
        500
      );
    }

    const command = new GetFaceLivenessSessionResultsCommand({
      SessionId: sessionId
    });
    const response = await rekognitionClient.send(command);

    return {
      confidence: typeof response.Confidence === "number" ? response.Confidence : null,
      status: response.Status || "UNKNOWN",
      referenceImage: encodeImageData(response.ReferenceImage),
      auditImages: Array.isArray(response.AuditImages)
        ? response.AuditImages.map((image) => encodeImageData(image)).filter(Boolean)
        : []
    };
  } catch (error) {
    throw mapAwsError(error, "Failed to get face liveness session result.");
  }
};

module.exports = {
  createSession,
  getSessionResult
};
