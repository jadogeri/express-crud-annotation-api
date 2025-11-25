import { DataSource, getMongoRepository, MongoRepository } from "typeorm";
import { Repository } from "../decorators";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { User } from "../entities/User.entity";
import { inject } from "inversify";
import { TYPES } from "../types/binding.types";

let count = 0;
@Repository()

export class UserRepository extends MongoRepository<User> implements IUserRepository {

    // constructor(@inject(TYPES.DataSource) private dataSource: DataSource) {
    //     super(User, dataSource.createEntityManager());
    // }

    

      constructor( @inject(TYPES.DataSource) private dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
        
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
        return await this.delete();
    }

      // Add custom methods here
  async findByEmail(email: string): Promise<User | null> {
    // findOneBy is a standard TypeORM method for simple conditions
    return await this.findOneBy({ email: email });
  }

  // You can add other custom methods as needed
  async findByName(name: string): Promise<User[]> {
    return this.find({
      where: { name },
    });
  }

  

}

