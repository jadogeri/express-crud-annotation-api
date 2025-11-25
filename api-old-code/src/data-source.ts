



import "reflect-metadata"; // Required for inversify and typeorm decorators
import { iocContainer} from "./configs/ioc.config";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity";
import { TYPES } from "./types/binding.types";
import { getCustomUserRepository, UserRepository } from "./repositories/UserRepository.repository";

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
    


    await dataSource.initialize().catch(()=>{
        const userRepository = getCustomUserRepository(dataSource);

    });

    // Bind the DataSource as a singleton
    iocContainer.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);
    iocContainer.bind<UserRepository>(TYPES.MongoRepositoryUser).to(UserRepository)

}
