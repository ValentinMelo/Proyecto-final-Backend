import winston from 'winston';

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: 'white',
    http: 'green',
    info: 'cyan',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
  },
};

const developmentLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevels.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const productionLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
});

export function getLogger() {
  if (process.env.NODE_ENV === 'production') {
    return productionLogger;
  } else {
    return developmentLogger;
  }
}

export const addLogger = (req, res, next) => {
  req.logger = getLogger();
  next();
};
