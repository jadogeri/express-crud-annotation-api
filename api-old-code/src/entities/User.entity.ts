// src/entities/User.ts
import { Entity,  Column, ObjectIdColumn, ObjectId } from "typeorm";

// Assuming a MongoDB setup from earlier context
@Entity()
export class User{
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;
}
