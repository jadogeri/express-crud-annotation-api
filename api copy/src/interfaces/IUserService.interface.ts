
export interface IUserService{
  create(): Promise<any>;
  getOne(): Promise<any>;
  getAll(): Promise<any>;
  update(): Promise<any>;
  delete(): Promise<any>;
}