export type IUser =  {
  email: string;
  name: string;
  updatedAt: Date;
  createdAt : Date;
}

export type UserCreationBody = Pick<IUser, "email" | "name">
