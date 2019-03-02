class Logger {
  log(message) {
    console.log(message);
  }

  info(message) {
    console.info(message);
  }

  error(err) {
    console.error(err);
  }

  warning(msg) {
    console.warn(msg);
  }
}

// singleton
const logger = new Logger();

export default logger;
