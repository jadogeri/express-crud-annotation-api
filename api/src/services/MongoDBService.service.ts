import { injectable } from "inversify";
import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";
import { IDatabaseService } from "../interfaces/IDatabaseService.interface";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

const mongoConnection : MongoConnectionOptions =  {

    type: process.env.DATASOURCE_TYPE as MongoConnectionOptions["type"] || "mongodb",
    host: process.env.DATASOURCE_HOST as MongoConnectionOptions["host"] || "localhost",
    port: process.env.DATASOURCE_HOST as MongoConnectionOptions["port"] || 27017,
    database: process.env.DATASOURCE_DATABASE as MongoConnectionOptions["database"] || "devDB",

}
@injectable()
export class MongoDBService implements IDatabaseService{
  
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: mongoConnection.type,
      host: mongoConnection.host,
      port: mongoConnection.port,
      database: mongoConnection.database,
      entities: [User],
      synchronize: true, // Use with caution in production
      logging: true,
    });
  }

  public async connect(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
      console.log("🛢️  Database connected and DataSource bound.");
    }
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }
}
