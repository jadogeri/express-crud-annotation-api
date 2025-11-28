import { DataSource } from "typeorm";

export interface IDatabaseService{
  connect(): Promise<void> ;

  getDataSource(): DataSource ;
}