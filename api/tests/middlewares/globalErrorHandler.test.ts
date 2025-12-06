
import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { constants } from "../../src/constants";
import { CustomError } from "../../src/exceptions/CustomError.exception";
import { globalErrorHandler } from '../../src/middlewares/globalErrorHandler.mtddleware';


// globalErrorHandler.middleware.test.ts


// globalErrorHandler.middleware.test.ts
describe('globalErrorHandler() globalErrorHandler method', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = { path: '/test-path' };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  // ------------------- Happy Paths -------------------
  describe('Happy paths', () => {
    test('should handle ValidateError and return 422 with details', () => {
      // This test ensures that a ValidateError is handled correctly and returns the expected response.
      const fields = { field1: { message: 'Invalid' } };
      const validateError = new ValidateError(fields, 'Validation failed');
      globalErrorHandler(validateError, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Validation Failed',
        details: fields,
      });
    });

    test('should handle CustomError with BAD_REQUEST status', () => {
      // This test ensures that a CustomError with BAD_REQUEST status returns the correct response.
      const error = new CustomError(constants.BAD_REQUEST, 'Bad request occurred');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Bad Request',
        message: 'Bad request occurred',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with NOT_FOUND status', () => {
      // This test ensures that a CustomError with NOT_FOUND status returns the correct response.
      const error = new CustomError( constants.NOT_FOUND, 'Resource not found');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Not Found',
        message: 'Resource not found',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with UNAUTHORIZED status', () => {
      // This test ensures that a CustomError with UNAUTHORIZED status returns the correct response.
      const error = new CustomError( constants.UNAUTHORIZED, 'Unauthorized access');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Unauthorized',
        message: 'Unauthorized access',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with FORBIDDEN status', () => {
      // This test ensures that a CustomError with FORBIDDEN status returns the correct response.
      const error = new CustomError( constants.FORBIDDEN, 'Forbidden access');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.FORBIDDEN);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Forbidden',
        message: 'Forbidden access',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with SERVER_ERROR status', () => {
      // This test ensures that a CustomError with SERVER_ERROR status returns the correct response.
      const error = new CustomError( constants.SERVER_ERROR, 'Server error occurred');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Server Error',
        message: 'Server error occurred',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with CONFLICT status', () => {
      // This test ensures that a CustomError with CONFLICT status returns the correct response.
      const error = new CustomError( constants.CONFLICT, 'Conflict occurred');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.CONFLICT);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Conflict',
        message: 'Conflict occurred',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with LOCKED_ACCOUNT status', () => {
      // This test ensures that a CustomError with LOCKED_ACCOUNT status returns the correct response.
      const error = new CustomError( constants.LOCKED_ACCOUNT, 'Account is locked');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.LOCKED_ACCOUNT);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Locked account',
        message: 'Account is locked',
        stackTrace: 'stacktrace',
      });
    });

    test('should handle CustomError with undefined statusCode and default to 500', () => {
      // This test ensures that a CustomError without a statusCode defaults to 500 and returns the correct response.
      const error = new CustomError(0, 'Unknown error');
      error.stack = 'stacktrace';
      // @ts-ignore
      error.statusCode = undefined;
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        "message": "Unknown error",
       "stackTrace": "stacktrace",
        "title": "Server Error",     
       });
    });
  });

  // ------------------- Edge Cases -------------------
  describe('Edge cases', () => {
    test('should handle CustomError with unknown statusCode and default to 500', () => {
      // This test ensures that a CustomError with an unknown statusCode defaults to 500 and returns the correct response.
      const error = new CustomError( 999, 'Unknown status code');
      error.stack = 'stacktrace';
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });

    test('should do nothing for unknown error types (not ValidateError or CustomError)', () => {
      // This test ensures that errors not matching ValidateError or CustomError are not handled and do not send a response.
      const error = new Error('Some generic error');
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    test('should handle ValidateError with empty fields', () => {
      // This test ensures that a ValidateError with empty fields is handled correctly.
      const fields = {};
      const validateError = new ValidateError(fields, 'Validation failed');
      globalErrorHandler(validateError, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Validation Failed',
        details: fields,
      });
    });

    test('should handle CustomError with missing stack property', () => {
      // This test ensures that a CustomError without a stack property is handled gracefully.
      const error = new CustomError( constants.BAD_REQUEST, 'No stack');
      // @ts-ignore
      error.stack = undefined;
      globalErrorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(constants.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        title: 'Bad Request',
        message: 'No stack',
        stackTrace: undefined,
      });
    });
  });
});