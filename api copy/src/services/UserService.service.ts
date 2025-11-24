import { inject, injectable } from "inversify";
import { Service } from "../decorators";
import { IUserService } from "src/interfaces/IUserService.interface";
import { DataSource, MongoRepository } from "typeorm";
import { User } from "../entities/User.entity";
import { UserRepository } from "src/repositories/UserRepository.repository";

let count = 0
@Service()
export class UserService implements IUserService{


    private userRepository: MongoRepository<User>;

    constructor(@inject(DataSource) private dataSource: DataSource) {
        this.userRepository = dataSource.getMongoRepository(User);
    }

  
    async create(): Promise<any> {

        return await this.userRepository.save(
            {
                email: "one@one",name : "john snow"
            }
        );
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
        return await this.userRepository.deleteAll()
    }

}