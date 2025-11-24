// src/repositories/UserRepository.ts
import { injectable, inject } from "inversify";
import { MongoRepository } from "typeorm";
import { User } from "../entities/User.entity";
import { IUserRepository } from "../interfaces/IUserRepository.interface";
import TYPES from "../config/types";
import { ObjectId } from "mongodb";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    // Injected via Inversify configuration
    @inject(TYPES.MongoUserRepository) private readonly repo: MongoRepository<User>
  ) {}

  public async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  public async findById(id: string): Promise<User | null> {
    // MongoDB requires ObjectID for finding by primary key
    return this.repo.findOneBy({ _id: new ObjectId(id) });
  }

  public async create(userData: Omit<User, '_id'>): Promise<User> {
    const newUser = this.repo.create(userData);
    return this.repo.save(newUser);
  }

  public async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userId = new ObjectId(id);
    await this.repo.update(userId, userData);
    return this.findById(id);
  }

  public async delete(id: string): Promise<boolean> {
    const userId = new ObjectId(id);
    const result = await this.repo.delete(userId);
    return result.affected as number > 0;
  }
}
