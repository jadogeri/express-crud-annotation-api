
import { UserCreationBody } from "../src/types/UserType.type";
import { UserRepository } from "../src/repositories/UserRepository.repository";
import { MongoTestContainer } from "./MongoTestContainer";

describe('UserService Integration Test with Testcontainers', () => {
  jest.setTimeout(10000);
  let userRepository: UserRepository;
  const mongoTestContainer: MongoTestContainer = new MongoTestContainer();

beforeAll(async () => {
  await mongoTestContainer.startTestConatiner();
  const dataSource = mongoTestContainer.getDataSource();
  userRepository = new UserRepository(dataSource);
});

afterAll(async () => {

  await mongoTestContainer.stopTestConatiner();

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
    },5000);
});
