import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import BaseResponse from "../utils/base_response";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json(BaseResponse.fail("Unauthorized", 401));
  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch {
    res.status(401).json(BaseResponse.fail("Unauthorized", 401));
  }
};
