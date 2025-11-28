import { injectable } from "inversify";
import { DataSource } from "typeorm";
import { User } from "../entities/User.entity";
import { IDatabaseService } from "../interfaces/IDatabaseService.interface";

@injectable()
export class MongoDBService implements IDatabaseService{
  
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "mongodb",
      host: "localhost",
      port: 27017,
      database: "testdb",
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
