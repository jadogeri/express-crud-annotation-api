
import { Request, Response } from "express";
import { notFoundHandler } from '../../src/middlewares/noRouteHandler.middleware';


// noRouteHandler.middleware.test.ts


// noRouteHandler.middleware.test.ts
describe('notFoundHandler() notFoundHandler method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should respond with 404 status and "Not Found" message when called with a valid request and response', () => {
      // This test aims to ensure the handler sets status 404 and sends the correct message.
      const req = {} as Request;
      const statusMock = jest.fn().mockReturnThis();
      const sendMock = jest.fn();
      const res = { status: statusMock, send: sendMock } as unknown as Response;

      notFoundHandler(req, res);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ message: 'Not Found' });
    });

    it('should allow the request object to be any valid Request', () => {
      // This test aims to ensure the handler does not depend on any property of req.
      const req = { some: 'property' } as Request;
      const statusMock = jest.fn().mockReturnThis();
      const sendMock = jest.fn();
      const res = { status: statusMock, send: sendMock } as unknown as Response;

      notFoundHandler(req, res);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ message: 'Not Found' });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should work even if the request object is an empty object', () => {
      // This test aims to ensure the handler does not throw if req is an empty object.
      const req = {} as Request;
      const statusMock = jest.fn().mockReturnThis();
      const sendMock = jest.fn();
      const res = { status: statusMock, send: sendMock } as unknown as Response;

      expect(() => notFoundHandler(req, res)).not.toThrow();
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ message: 'Not Found' });
    });

    it('should work if the response object has status and send methods only', () => {
      // This test aims to ensure the handler only relies on status and send methods.
      const statusMock = jest.fn().mockReturnThis();
      const sendMock = jest.fn();
      const res = { status: statusMock, send: sendMock } as unknown as Response;

      notFoundHandler({} as Request, res);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ message: 'Not Found' });
    });

    it('should call status before send', () => {
      // This test aims to ensure status is called before send.
      const callOrder: string[] = [];
      const statusMock = jest.fn().mockImplementation(() => {
        callOrder.push('status');
        return res;
      });
      const sendMock = jest.fn().mockImplementation(() => {
        callOrder.push('send');
      });
      const res = { status: statusMock, send: sendMock } as unknown as Response;

      notFoundHandler({} as Request, res);

      expect(callOrder).toEqual(['status', 'send']);
    });

    it('should not modify the response object except calling status and send', () => {
      // This test aims to ensure no other properties are accessed or modified.
      const statusMock = jest.fn().mockReturnThis();
      const sendMock = jest.fn();
      const res = { status: statusMock, send: sendMock, custom: 123 } as unknown as Response;

      notFoundHandler({} as Request, res);

      expect(res.custom).toBe(123);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({ message: 'Not Found' });
    });
  });
});