const { failure } = require("../utils/apiResponse");

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return failure(res, err.message || "Server Error", statusCode);
}

module.exports = { notFound, errorHandler };
