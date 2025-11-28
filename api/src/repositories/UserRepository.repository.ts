import { DataSource, Repository as BaseRepository, ObjectId } from "typeorm";
import { Repository } from "../decorators";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import { User } from "../entities/User.entity";
import { inject } from "inversify";
import { TYPES } from "../types/binding.types";
import mongoose from "mongoose";


@Repository()
export class UserRepository extends BaseRepository<User> implements IUserRepository {

    constructor(@inject(TYPES.DataSource) private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ where: { email } });
    }

    async findByName(name: string): Promise<User | null> {
        return await this.findOne({ where: { name } });
    }

    async findById(id: mongoose.Types.ObjectId) {
        return await this.findOne({ where: { _id: id } });
    }
}