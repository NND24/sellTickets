import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const vietnamTime = () => {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: vietnamTime }), // Sử dụng hàm custom
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}][${level.toUpperCase()}]: ${message}`;
    })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({
      filename: "./logs/server.log",
      options: { flags: "a" },
    }),
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: vietnamTime }), // Sử dụng hàm custom
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
  ],
});

// Override console.log
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args); // Call the original console.log
  logger.info(args.join(" ")); // Use the Winston logger to log
};

export default logger;
