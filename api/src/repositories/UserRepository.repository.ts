import { DataSource, Repository as BaseRepository } from "typeorm";
import { Repository } from "../decorators";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { User } from "../entities/User.entity";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/binding.types";


@Repository()
export class UserRepository extends BaseRepository<User> implements IUserRepository {

    constructor(@inject(TYPES.DataSource) private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User[] | null> {
        return await this.find({ where: { email } });
    }

    async findByName(name: string): Promise<User[] | null> {
        return await this.find({ where: { name } });
    }

}