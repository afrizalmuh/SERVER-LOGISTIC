import winston, {Logger} from "winston";
import 'winston-daily-rotate-file';
import moment from "moment";
import { config } from 'dotenv';
config()
const { combine, timestamp, printf, colorize, align, json } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

let logger: Logger;

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "./logs/%DATE%-logistic-api.log",
  frequency: "24h",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxFiles: '1d'
})

if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "PRODUCTION") {
  logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || "info",
    exitOnError: false,
    // format: combine(timestamp(), json()),
    format: combine(
      // colorize({all:true})
      timestamp({
        format:"YYYY-MM-DD HH:mm:ss.SSS",
      }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    defaultMeta: { service: "logistic-service" },
    transports: [
      fileRotateTransport,
      new winston.transports.File({
        filename: `./logs/error.log`,
        level: "error",
      }),
      new winston.transports.File({
        filename: `./logs/${moment().format("YYYY-MM-DD")}-logistic-api.log`,
      }),
    ]
  })
} else {
  logger = winston.createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || "info",
    exitOnError: false,
    format: combine(
      // colorize({all:true})
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS"
      }),
      align(),
      printf((info)=> `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    defaultMeta: { servie: "logistic-service" },
    transports: [
      fileRotateTransport,
      new winston.transports.File({
        filename: `./logs/error.log`,
        level: "error"
      }),
      new winston.transports.File({
        filename: `./logs/debug/${moment().format("YYYY-MM-DD")}-logistic-api.log`,
        level:"debug"
      }),
      new winston.transports.File({
        filename: `./logs/${moment().format("YYYY-MM-DD")}-logistic-api.log`,
      })
    ]
  })

  logger.add(
    new winston.transports.Console({
      //   format: winston.format.cli(),
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss.SSS",
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    })
  );
}

// const logger = {
//   request: expressWinston.logger({
//     transports: [
//       fileRotateTransport
//     ],
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.printf((info) => {
//         let body = {
//           id: info.meta.req.id,
//           tag: 'REQ',
//           method: info.meta.req.method,
//           endpoint: info.meta.req.origialUrl,
//           time: moment().format(),
//           header: info.meta.req.headers,
//           payload: info.meta.req.body || {}
//         };
//         return `[${moment().format()}] | ${JSON.stringify(body)}`
//       })
//     ),
//     requestWhitelist: [...expressWinston.requestWhitelist, 'body', 'id', 'ip']
//   })
// }

export default logger