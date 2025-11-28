import mongoose from "mongoose";
import { UserCreationBody, UserUpdateBody } from "../types/UserType.type";

export interface IUserService{
  create(requestBody: UserCreationBody): Promise<any>;
  getOne(mognoId: mongoose.Types.ObjectId): Promise<any>;
  getAll(): Promise<any>;
  update(mognoId: mongoose.Types.ObjectId,  requestBody: UserUpdateBody): Promise<any>;
  delete(mognoId: mongoose.Types.ObjectId): Promise<any>;
}