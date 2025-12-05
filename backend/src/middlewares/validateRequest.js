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
        const errors = err.errors.map((e) => ({ path: e.path, message: e.message }));
        console.error("Validation failed:", JSON.stringify(errors, null, 2));
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        return failure(
          res,
          "Validation error",
          422,
          errors
        );
      }
      return next(err);
    }
  };
}

module.exports = { validate };
