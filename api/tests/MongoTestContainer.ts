// tests/test-environment.ts
import 'reflect-metadata'; // Required by TypeORM

import { DataSource } from "typeorm";
import { User } from "../src/entities/User.entity";
import { GenericContainer, StartedTestContainer } from "testcontainers";

const MONGODB_IMAGE = "mongo:latest"; // Use a specific version in production code

// Define the container (e.g., in a test utility file)

export class MongoTestContainer {
  private mongoContainer: StartedTestContainer | null = null;
  private dataSource: DataSource;

 private createMongoContainer = async () => {
  const container : StartedTestContainer= await new GenericContainer(MONGODB_IMAGE)
    .withExposedPorts(27017)
    .start();

  // Get the dynamically assigned host and port
  const host : string = container.getHost();
  const port : number = container.getMappedPort(27017);

  // Return connection details or a connection string
  return { container, host, port };
};

  public startTestConatiner  = async ()=>{
    const details = await this.createMongoContainer();
    this.mongoContainer = details.container;

    // Use the dynamic host and port instead of 'localhost:27017'
    this.dataSource = new DataSource({
      type: "mongodb",
      host: details.host,
      port: details.port,
      database: "testdb",
      entities:[User]
      // ... other TypeORM configurations (entities, logging, etc.)
    });

    this.dataSource = await this.dataSource.initialize();

  }

  public stopTestConatiner  = async ()=>{
    if (this.dataSource){
       await this.dataSource.destroy()

    };
    if (this.mongoContainer){ 
      await this.mongoContainer.stop();
    };

  }

  public getDataSource =()=>{
    return this.dataSource;
  }

}

