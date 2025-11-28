
import mongoose from "mongoose";

export interface IUserRepository  {
    findByName(name: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findById(id: mongoose.Types.ObjectId): Promise<any>;
}
