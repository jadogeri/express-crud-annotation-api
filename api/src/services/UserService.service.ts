import { inject, injectable } from "inversify";
import { Service } from "../decorators";
import { IUserService } from "../interfaces/IUserService.interface";
import { DataSource, MongoRepository } from "typeorm";
import { User } from "../entities/User.entity";
import { UserRepository } from "../repositories/UserRepository.repository";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { TYPES } from "../types/binding.types";
import { UserCreationBody } from "../types/UserType.type";

// @Service()
@injectable()
export class UserService implements IUserService{

  constructor(@inject(TYPES.IUserRepository) private userRepository: UserRepository) {}

  
    
    async create(requestBody: UserCreationBody): Promise<any> {


        const savedUser =  this.userRepository.save(requestBody);        

        return savedUser;
        
    }
    async getOne(): Promise<any> {
        return await this.userRepository.find();
    }
    async getAll(): Promise<any> {

        return await this.userRepository.findByName("joseph");
    }
    async update(): Promise<any> {
        return await this.userRepository.find();
    }
    async delete(): Promise<any> {
        return  this.userRepository.clear();
    }

}