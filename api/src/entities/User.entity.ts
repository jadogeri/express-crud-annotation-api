// src/entities/User.ts
import { IUser } from "../types/UserType.type";
import { Entity,  Column, ObjectIdColumn, ObjectId, CreateDateColumn, UpdateDateColumn } from "typeorm";

// Assuming a MongoDB setup from earlier context
@Entity()
export class User implements IUser{
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date
}
