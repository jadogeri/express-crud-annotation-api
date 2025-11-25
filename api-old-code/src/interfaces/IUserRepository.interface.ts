import { MongoRepository } from "typeorm";
import { User } from "../entities/User.entity";

export interface IUserRepository extends MongoRepository<User> {
 findByEmail(email: string): Promise<User | null>;
 findAll(): Promise<any>;
  findById(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}
