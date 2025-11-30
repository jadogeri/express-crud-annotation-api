
import { UserRepository } from "../../../src/repositories/UserRepository.repository";
import { UserCreationBody } from "../../../src/types/UserType.type";
import { UserService } from '../../../src/services/UserService.service';


// api/src/services/UserService.service.create.spec.ts
// Mock for mongoose (as per instructions)

// Manual mock for UserRepository
const mockUserRepository = {
  findByEmail: jest.fn(),
  save: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

// Helper: mock CustomError
jest.mock("../../../src/exceptions/CustomError.exception", () => {
  return {
    CustomError: jest.fn().mockImplementation((status: number, message: string) => {
      return { status, message, name: 'CustomError' };
    }),
  };
});

describe('UserService.create() create method', () => {
  let userService: UserService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    userService = new UserService(mockUserRepository as any);
  });

  // Happy Paths
  describe('Happy Paths', () => {
    it('should create a user when email and name are unique', async () => {
      // This test ensures that a user is created when both email and name are unique.
      const requestBody: UserCreationBody = {
        email: 'unique@email.com',
        name: 'uniqueName',
        age: 30,
      };

      // No user found by email
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      // No user found by name
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      // Save returns the created user
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });

    it('should handle creation with minimal valid data', async () => {
      // This test ensures that the method works with minimal valid data.
      const requestBody: UserCreationBody = {
        email: 'min@email.com',
        name: 'minName',
        age: 0,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should throw CustomError if user with same email exists', async () => {
      // This test ensures that the method throws an error if the email already exists.
      const requestBody: UserCreationBody = {
        email: 'duplicate@email.com',
        name: 'newName',
        age: 25,
      };

      // User found by email
      const existingUser = { email: requestBody.email, name: 'otherName', age: 40 };
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(existingUser as any);

      await expect(userService.create(requestBody)).rejects.toMatchObject({
        status: 400,
        message: `user with email '${requestBody.email}' already exists`,
        name: 'CustomError',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw CustomError if user with same name exists', async () => {
      // This test ensures that the method throws an error if the name already exists.
      const requestBody: UserCreationBody = {
        email: 'new@email.com',
        name: 'duplicateName',
        age: 22,
      };

      // No user found by email
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      // User found by name
      const existingUser = { email: 'other@email.com', name: requestBody.name, age: 33 };
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(existingUser as any);

      await expect(userService.create(requestBody)).rejects.toMatchObject({
        status: 400,
        message: `user with name '${requestBody.name}' already exists`,
        name: 'CustomError',
      });

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should propagate errors thrown by userRepository.save', async () => {
      // This test ensures that errors from the repository are propagated.
      const requestBody: UserCreationBody = {
        email: 'unique@email.com',
        name: 'uniqueName',
        age: 30,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const repoError = new Error('Database save failed');
      jest.mocked(mockUserRepository.save).mockRejectedValueOnce(repoError as never);

      await expect(userService.create(requestBody)).rejects.toThrow('Database save failed');

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
    });

    it('should handle edge case where name and email are the same string', async () => {
      // This test ensures that the method works when name and email are the same string.
      const requestBody: UserCreationBody = {
        email: 'same@string.com',
        name: 'same@string.com',
        age: 45,
      };

      // No user found by email
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      // No user found by name
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });

    it('should handle edge case with very long name and email', async () => {
      // This test ensures that the method works with very long strings for name and email.
      const longString = 'a'.repeat(1000);
      const requestBody: UserCreationBody = {
        email: `${longString}@test.com`,
        name: longString,
        age: 99,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });

    it('should handle edge case with age at lower boundary (0)', async () => {
      // This test ensures that the method works when age is at its lower boundary.
      const requestBody: UserCreationBody = {
        email: 'lower@boundary.com',
        name: 'LowerBoundary',
        age: 0,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });

    it('should handle edge case with age at upper boundary (e.g., 120)', async () => {
      // This test ensures that the method works when age is at its upper boundary.
      const requestBody: UserCreationBody = {
        email: 'upper@boundary.com',
        name: 'UpperBoundary',
        age: 120,
      };

      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any);
      const savedUser = {
        _id: 'mocked-object-id',
        ...requestBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.mocked(mockUserRepository.save).mockResolvedValueOnce(savedUser as any);

      const result = await userService.create(requestBody);

      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(1, requestBody.email);
      expect(mockUserRepository.findByEmail).toHaveBeenNthCalledWith(2, requestBody.name);
      expect(mockUserRepository.save).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(savedUser);
    });
  });
});