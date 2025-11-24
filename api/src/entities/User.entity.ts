// src/entities/User.ts
import 'reflect-metadata'; 

import { Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn, ObjectId } from "typeorm";

// Assuming a MongoDB setup from earlier context
@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  email: string;
}
