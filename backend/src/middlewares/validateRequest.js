const { ZodError } = require("zod");
const { failure } = require("../utils/apiResponse");

function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return failure(
          res,
          "Validation error",
          422,
          err.errors.map((e) => ({ path: e.path, message: e.message }))
        );
      }
      return next(err);
    }
  };
}

module.exports = { validate };
