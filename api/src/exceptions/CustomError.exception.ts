export class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype); // Important for instanceof checks
  }
}