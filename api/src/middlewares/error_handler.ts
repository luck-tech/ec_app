import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {HttpClientError} from "@/lib/errors";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  if (error instanceof HttpClientError) {
    res
      .status(error.statusCode)
      .json({message: error.message, errors: error.errors});
    return;
  }

  res.status(500).json({message: "Internal server error"});
};
