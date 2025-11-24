import { inject, injectable } from "inversify";
import { Service } from "../decorators";
import { IUserService } from "src/interfaces/IUserService.interface";
import { User } from "../entities/User.entity";
import { UserRepository } from "../repositories/UserRepository.repository";
import { TYPES } from "../types/binding.types";
import { Repository as BaseRepository } from "typeorm";

let count = 0
@Service()
export class UserService implements IUserService{

    private readonly userRepository: BaseRepository<User>;

    constructor(@inject(TYPES.IUserRepository) private repo: UserRepository) {
 
        this.userRepository = repo;
    }

  
    async create(): Promise<any> {

        return await this.userRepository.find();
    }
    async getOne(): Promise<any> {
        return await this.userRepository.find();
    }
    async getAll(): Promise<any> {

        return await this.userRepository.find();
    }
    async update(): Promise<any> {
        return await this.userRepository.find();
    }
    async delete(): Promise<any> {
        return await this.userRepository.find();
    }

}