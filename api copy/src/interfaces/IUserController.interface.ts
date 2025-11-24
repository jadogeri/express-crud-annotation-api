export interface IUserController{
  createUser(): Promise<any>;
  getUser(): Promise<any>;
  getUsers(): Promise<any>;
  updateUser(): Promise<any>;
  deleteUser(): Promise<any>;
}