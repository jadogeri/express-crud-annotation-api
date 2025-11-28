import { constants } from "../constants";
import { Response, Request,NextFunction } from "express";
import { CustomError } from "../exceptions/CustomError.exception";
import { ValidateError } from "tsoa";
export const globalErrorHandler = (err : unknown, req : Request, res : Response, next : NextFunction) => {

  console.log("calling handler..........................................")
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  //CustomError is sublcass of Error
  if (err instanceof CustomError) {
  const statusCode = err.statusCode ? err.statusCode : 500;
  console.log("status codes: ", statusCode )
  switch (statusCode) {
    case constants.BAD_REQUEST:
      res.status(statusCode).json({
        title: "Bad Request",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.status(statusCode).json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.CONFLICT:
      res.status(statusCode).json({
        title: "Conflict",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.LOCKED_ACCOUNT:
      res.status(statusCode).json({
        title: "Locked account",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
   res.status(500).json({
      message: "Internal Server Error",
    })
      break;
  }
  }

}


