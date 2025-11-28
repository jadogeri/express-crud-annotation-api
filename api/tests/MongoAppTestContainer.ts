// tests/test-environment.ts
    import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { DataSource } from "typeorm";
import { User } from "../src/entities/User.entity";
import mongoose from 'mongoose';

let mongoContainer: MongoDBContainer | null;
let appDataSource: DataSource;
let startedContainer : StartedMongoDBContainer | null = null;

export const startTestDatabase = async () => {
    mongoContainer = new MongoDBContainer("mongo:6.0.1");

    startedContainer  = await mongoContainer.start();
    // Get the dynamic connection URI from the container
    const uri = startedContainer.getConnectionString()
    const host = startedContainer.getHost();
    const port = startedContainer.getFirstMappedPort();

    console.log("connection uri ==", uri)
  appDataSource = new DataSource({
    type: "mongodb",
    host:  host,
    port: port,
    database: "testDB",
    entities: [User],
    synchronize: true, // Auto-create collections for testing
  });

  const result = await appDataSource.initialize();
  return result;
};

export const stopTestDatabase = async () => {
  if (appDataSource) {
    await appDataSource.destroy();
  }
  if (startedContainer) {
    
    await startedContainer?.stop();
    mongoContainer = null
  }
    console.log("Database connection closed and container stopped.");

};

export const getDataSource = () => appDataSource;


export const connectDb = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};