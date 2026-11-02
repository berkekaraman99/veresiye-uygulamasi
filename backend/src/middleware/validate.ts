import type { RequestHandler } from "express";
import type { ObjectSchema } from "yup";

export const validate =
  (
    schema: ObjectSchema<any>,
    source: "body" | "query" = "body",
  ): RequestHandler =>
  async (req, res, next) => {
    try {
      const value = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      if (source === "body") {
        req.body = value;
      } else {
        res.locals.query = value;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
