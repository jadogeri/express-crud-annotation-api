import { DataSource, MongoRepository } from "typeorm";
import { Repository } from "../decorators";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { User } from "../entities/User.entity";
import { inject } from "inversify";
import { TYPES } from "../types/binding.types";

let count = 0;
@Repository()

export class UserRepository extends MongoRepository<User> implements IUserRepository{

    // constructor(@inject(TYPES.DataSource) private dataSource: DataSource) {
    //     super(User, dataSource.createEntityManager());
    // }

    
    private readonly repository: MongoRepository<User>;

      constructor(@inject(TYPES.MongoRepositoryUser) repository: MongoRepository<User>, @inject(TYPES.DataSource) private dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
        this.repository = repository;
        
  }

    findAll(): Promise<any> {

        return this.findAll();
    }
    async findById(): Promise<any> {
        return { name: "john doe"};
    }
    async save(): Promise<any> {
        return { name: "john doe"};
    }
    async update(): Promise<any> {
        return { name: "john doe"};
    }
    async delete(): Promise<any> {
        return { name: "john doe"};
    }

    async deleteAllRows(): Promise<any> {
        return { name: "john doe"};
    }


}