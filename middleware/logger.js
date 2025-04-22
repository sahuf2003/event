const requestLogger = (req, _, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip} @ ${new Date().toISOString()}`);
    next();
  };
  module.exports = { requestLogger };