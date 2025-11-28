import { UserCreationBody, UserUpdateBody } from "../types/UserType.type";

export interface IUserController{
  createUser(requestBody: UserCreationBody): Promise<any>;
  getUser(userId: string): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(userId: string, requestBody: UserUpdateBody): Promise<any>;
  deleteUser(userId: string): Promise<any>;
}