import mongoose from "mongoose";
import { UserCreationBody } from "../types/UserType.type";

export interface IUserService{
  create(requestBody: UserCreationBody): Promise<any>;
  getOne(mognoId: mongoose.Types.ObjectId): Promise<any>;
  getAll(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}