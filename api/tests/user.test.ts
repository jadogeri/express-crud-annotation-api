// src/user.test.ts
import "reflect-metadata"; // Must be imported at the top
import { MongoDBContainer, StartedMongoDBContainer } from "@testcontainers/mongodb";
import { DataSource, MongoClient } from "typeorm";
import { Container } from "inversify";
import { UserRepository } from "../src/repositories/UserRepository.repository";
import { TYPES } from "../src/types/binding.types";
import { User } from "../src/entities/User.entity";
import { IUserService } from "../src/interfaces/IUserService.interface";
import { UserService } from "../src/services/UserService.service";
import { IUserRepository } from "../src/interfaces/IUserRepository.interface";

describe("UserRepository Integration Tests", () => {
    let container:  StartedMongoDBContainer ;
    let unStartedContainer : MongoDBContainer;

    let dataSource: DataSource;
    let inversifyContainer: Container;
    let userRepository: UserRepository;
    const DB_STARTUP_TIMEOUT = 60000; // 60 seconds

    beforeAll(async () => {
        // Start the MongoDB Testcontainer once for all tests
        // container = new MongoDBContainer("mongo:6.0.1");
        // startedContainer = await container.start();
        // const uri = startedContainer.getConnectionString();
        


        // // Initialize TypeORM DataSource
        // dataSource = new DataSource({
        //     type: "mongodb",
        //     host: startedContainer.getHost(),
        //     port: startedContainer.getFirstMappedPort(),            
        //     url: uri,
        //     database:"testDatabase",
        //     synchronize: true, // Use synchronize: true in test environment
        //     entities: [User],
        // });
        // console.log("datasource : ", dataSource)

        // const result = await dataSource.initialize();
        // result.createEntityManager();

    container = await new MongoDBContainer("mongo:6.0.1").start();
    // Use getConnectionString() for a standard container or getReplicaSetUrl() for a replica set
    let connectionString = container.getConnectionString(); // or container.getReplicaSetUrl()
    
    // Append `?directConnection=true` if using a single-node replica set and encountering connection errors
     connectionString = `${container.getConnectionString()}?directConnection=true`;

           unStartedContainer =  new MongoDBContainer("mongo:6.0.1");
        let startedContainer = await unStartedContainer.start();
        //const uri = startedContainer.getConnectionString(); 
        console.log("connnnnnnnnnnnnnnnsssssssssssssssssss: ", connectionString )

            dataSource = new DataSource({
            type: "mongodb",
            host: startedContainer.getHost(),
            port: startedContainer.getFirstMappedPort(),            
            url: connectionString,
            database:"testDatabase",
            synchronize: true, // Use synchronize: true in test environment
            entities: [User],
        });
        console.log("datasource : ", dataSource)


        
    }, DB_STARTUP_TIMEOUT); // Increased timeout for container startup and binary download

    afterAll(async () => {
        // Stop the container after all tests are done
        await dataSource.destroy();
        await container.stop();

    });

    beforeEach(async () => {
        // Clear the database or drop schema before each test to ensure isolation
        await dataSource.manager.connection.dropDatabase();
        
        // Create a fresh Inversify container for each test to avoid state leakage
        inversifyContainer = new Container();

        // Bind the active DataSource and Repository
        inversifyContainer.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);
        // Bind the repository using a provider or to the class itself, ensuring it uses the injected DataSource
        inversifyContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
        
        // Bind other services that depend on the repository
         inversifyContainer.bind<IUserService>(TYPES.UserService).to(UserService);

        userRepository = inversifyContainer.get<UserRepository>(TYPES.IUserRepository);
    });

    it("should save a user to the database", async () => {
        const user = new User();
        user.email = "test@example.com";
        user.name = "Test User";
        user.age = 10;

        await userRepository.save(user);

        const foundUser = await userRepository.findByEmail("test@example.com");
        expect(foundUser).toBeDefined();
        expect(foundUser?.email).toBe("test@example.com");
    });
    
    // Add more tests here
});
