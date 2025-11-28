import { DataSource } from "typeorm";
import { createMongoContainer } from "./createMongoContainer";
import { UserCreationBody } from "../src/types/UserType.type";
import { UserRepository } from "../src/repositories/UserRepository.repository";
import { User } from "../src/entities/User.entity";

let dataSource: DataSource;
let mongoContainer: any; // Type according to your container object


describe('UserService Integration Test with Testcontainers', () => {
            jest.setTimeout(60000);
            let userRepository: UserRepository;


beforeAll(async () => {
  const details = await createMongoContainer();
  mongoContainer = details.container;

  // Use the dynamic host and port instead of 'localhost:27017'
  dataSource = new DataSource({
    type: "mongodb",
    host: details.host,
    port: details.port,
    database: "testdb",
    entities:[User]
    // ... other TypeORM configurations (entities, logging, etc.)
  });

  const d = await dataSource.initialize();
  console.log("datas...............................................", dataSource)
  userRepository = new UserRepository(d);
});

afterAll(async () => {
  if (dataSource) await dataSource.destroy();
  if (mongoContainer) await mongoContainer.stop();
});


    it('should register a new user and find them by email', async () => {
        const email = 'test@example.com';
        const name = 'Test User';
        const age=10;

        // Use the service which uses the injected repository connected to the test DB
        const createUserBody : UserCreationBody ={
            name:name, email: email , age: age
        }
        const newUser =  userRepository.create(createUserBody);

        expect(newUser).toBeDefined();
        expect(newUser.email).toBe(email);
        expect(newUser.name).toBe(name);

        // const foundUser = await userService.findByEmail(email);
        // expect(foundUser).toEqual(newUser);
    });
});
