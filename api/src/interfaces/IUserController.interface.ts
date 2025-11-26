import { UserCreationBody } from "src/types/UserType.type";

export interface IUserController{
  createUser(requestBody: UserCreationBody): Promise<any>;
  getUser(): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(): Promise<any>;
  deleteUser(): Promise<any>;
}