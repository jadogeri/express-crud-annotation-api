


import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";
import "reflect-metadata"; // Required for inversify and typeorm decorators
import { iocContainer} from "./configs/ioc.config";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";
import { TYPES } from "./types/binding.types";

const mongoConnection : MongoConnectionOptions =  {

    type: process.env.DATASOURCE_TYPE as MongoConnectionOptions["type"] || "mongodb",
    host: process.env.DATASOURCE_HOST as MongoConnectionOptions["host"] || "localhost",
    port: process.env.DATASOURCE_HOST as MongoConnectionOptions["port"] || 27017,
    database: process.env.DATASOURCE_DATABASE as MongoConnectionOptions["database"] || "devDB",

}
export const initializeDatabase = async () => {
    const dataSource = new DataSource({
        type: mongoConnection.type,
        host: mongoConnection.host,
        port: mongoConnection.port,
        database: mongoConnection.database,
        entities: [User], // List your entities here
        synchronize: true, // Use carefully in production; automatically creates/updates schema
        logging: false,
    });
    

    await dataSource.initialize();

    // Bind the DataSource as a singleton
    iocContainer.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);

}
