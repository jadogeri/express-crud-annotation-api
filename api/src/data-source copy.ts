import "reflect-metadata"; // Required for inversify and typeorm decorators
import { iocContainer} from "./configs/ioc.config";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";
import { TYPES } from "./types/binding.types";

export const initializeDatabase = async () => {
    const dataSource = new DataSource({
        type: "mongodb",
        host: "localhost",
        port: 27017,
        database: "devDB",
        entities: [User], // List your entities here
        synchronize: true, // Use carefully in production; automatically creates/updates schema
        logging: false,
    });
    

    await dataSource.initialize();

    // Bind the DataSource as a singleton
    iocContainer.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);

    console.log("🛢️  Database connected and DataSource bound.");

}
