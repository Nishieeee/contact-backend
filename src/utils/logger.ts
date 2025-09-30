import winston from "winston";
import path from "path";

// Log file paths
const logDir = path.join(__dirname, "../../logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    // Console output
    new winston.transports.Console(),
    // File outputs
    new winston.transports.File({ filename: `${logDir}/error.log`, level: "error" }),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
  ],
});

export default logger;
