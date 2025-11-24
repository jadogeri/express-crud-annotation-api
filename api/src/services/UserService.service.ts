import { inject, injectable } from "inversify";
import { Service } from "../decorators";
import { IUserRepository } from "src/interfaces/IUserRepository.interface";
import { IUserService } from "src/interfaces/IUserService.interface";
import { TYPES } from "../types/binding.types";


@Service()
export class UserService implements IUserService{

    private userRepository: IUserRepository;

  constructor(@inject(TYPES.IUserRepository) userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
    async create(): Promise<any> {
        return await this.userRepository.create();
    }
    async getOne(): Promise<any> {
        return await this.userRepository.findById();
    }
    async getAll(): Promise<any> {
        return await this.userRepository.findAll();
    }
    async update(): Promise<any> {
        return await this.userRepository.update();
    }
    async delete(): Promise<any> {
        return await this.userRepository.delete();
    }

}