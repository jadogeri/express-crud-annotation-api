import mongoose from "mongoose";

/**
 * Represents a user object with database timestamps and ID.
 */
export interface UserReadResponse {
  /**
   * The unique identifier of the user (e.g., MongoDB ObjectId).
   * @example "60b8f4d5f8a3c3001f3e9a0e"
   */
  _id: mongoose.Types.ObjectId;
  /**
   * The user's name.
   * @example "John Doe"
   */
  name: string
  /**
   * The user's email.
   * @pattern ^(.+)@(.+)$ please provide correct email
   * @example "JohnDoe@gmail.com"
   */
  email: string;
  /**
   * The user's age.
   * @isInt we would kindly ask you to provide a number here
   * @minimum 0 minimum age is 0
   * @example 21
   */
  age: number;
  /**
   * The date and time when the user was created.
   * @format date-time
   * @example "2024-01-01T12:00:00.000Z"
   */
  createdAt: Date;
  /**
   * The date and time when the user was last updated.
   * @format date-time
   * @example "2024-01-01T13:00:00.000Z"
   */
  updatedAt: Date;
}
