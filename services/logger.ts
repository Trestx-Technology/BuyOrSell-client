import pino from 'pino';

/**
 * Global logger service using Pino
 * Works in both client and server environments
 */

// Determine if we're in browser or server
const isBrowser = typeof window !== 'undefined';

// Base logger configuration
const baseConfig: pino.LoggerOptions = {
  level: process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Browser-specific configuration
const browserConfig: pino.LoggerOptions = {
  ...baseConfig,
  browser: {
    asObject: false,
    write: {
      info: (o: unknown) => console.info(o),
      error: (o: unknown) => console.error(o),
      warn: (o: unknown) => console.warn(o),
      debug: (o: unknown) => console.debug(o),
      trace: (o: unknown) => console.trace(o),
      fatal: (o: unknown) => console.error(o),
    },
  },
};

// Server-specific configuration with pretty printing in development
const serverConfig: pino.LoggerOptions = {
  ...baseConfig,
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        }
      : undefined,
};

// Create the logger instance
export const logger = isBrowser
  ? pino(browserConfig)
  : pino(serverConfig);

// Export convenience methods
export const log = {
  debug: (message: string, context?: Record<string, unknown>) => {
    logger.debug(context || {}, message);
  },
  info: (message: string, context?: Record<string, unknown>) => {
    logger.info(context || {}, message);
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    logger.warn(context || {}, message);
  },
  error: (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
    if (error instanceof Error) {
      logger.error({ ...context, err: error, errorMessage: error.message, errorStack: error.stack }, message);
    } else {
      logger.error(context || {}, message);
    }
  },
  success: (message: string, context?: Record<string, unknown>) => {
    logger.info({ ...context, type: 'success' }, message);
  },
};

// Export the logger instance for advanced usage
export default logger;

