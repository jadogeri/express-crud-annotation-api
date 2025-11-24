import { DataSource, MongoRepository, Repository as BaseRepository } from "typeorm";
import { Repository } from "../decorators";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { User } from "../entities/User.entity";
import { inject } from "inversify";
import { TYPES } from "../types/binding.types";

@Repository()

export class UserRepository extends BaseRepository<User> implements IUserRepository{

    // constructor(@inject(TYPES.DataSource) private dataSource: DataSource) {
    //     super(User, dataSource.createEntityManager());
    // }

    //@inject(TYPES.MongoRepositoryUser)
    // private readonly repository: MongoRepository<User>;

      constructor( @inject(TYPES.DataSource) private dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
        // this.repository = repository;
        
  }

    findAll(): Promise<any> {

        return this.find();
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
        return { message: "deleted user successful"};
    }


}