import { User } from "../entities/User.entity";

export interface IUserRepository {
  deleteAllRows(): Promise<any>;
}
