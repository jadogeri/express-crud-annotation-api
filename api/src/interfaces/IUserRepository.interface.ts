import { User } from "../entities/User.entity";

export interface IUserRepository {
  findAll(): Promise<any>;
  findById(): Promise<any>;
  create(): Promise<User>;
  update(): Promise<any>;
  delete(): Promise<any>;
}
