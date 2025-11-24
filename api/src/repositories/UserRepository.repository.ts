import { Repository } from "../decorators";
import { IUserRepository } from "src/interfaces/IUserRepository.interface";


@Repository()
export class UserRepository implements IUserRepository{
    async findAll(): Promise<any> {
        return  [{ name: "john doe"}, { name: "jane doe"}];
    }
    async findById(): Promise<any> {
        return { name: "john doe"};
    }
    async create(): Promise<any> {
        return { name: "john doe"};
    }
    async update(): Promise<any> {
        return { name: "john doe"};
    }
    async delete(): Promise<any> {
        return { name: "john doe"};
    }

}