import { MongoRepository, Repository } from "typeorm";
import { User } from "../entities/User.entity";

export interface IUserRepository  {
    findByName(name: string): Promise<any>;
    findByEmail(email: string): Promise<any>;



}
