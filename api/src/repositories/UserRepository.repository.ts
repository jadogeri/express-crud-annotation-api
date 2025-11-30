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

/**
     * Retrieves a User object by their email address.
     * @param email - The email address of the user to find.
     * @returns A Promise that resolves to the User object if found, or null if not.
     * @throws Throws an error if the database query fails.
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ where: { email } });
    }


/**
     * Retrieves a User object by its name.
     * @param name - The name of the user to search for.
     * @returns A Promise that resolves to a User object or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async findByName(name: string): Promise<User | null> {
        return await this.findOne({ where: { name } });
    }

/**
     * Retrieves a document by its unique identifier from the database.
     * @param id - The unique identifier of the document to be retrieved.
     * @returns A promise that resolves to the found document or null if not found.
     * @throws Throws an error if the database query fails.
     */
    async findById(id: mongoose.Types.ObjectId) {
        return await this.findOne({ where: { _id: id } });
    }
}