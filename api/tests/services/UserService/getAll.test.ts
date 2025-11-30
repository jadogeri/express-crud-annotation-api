


// UserService.service.getAll.spec.ts

import { UserRepository } from "../../../src/repositories/UserRepository.repository";
import { UserService } from "../../../src/services/UserService.service";

// Mock for mongoose (as per instruction)
class Mockmongoose {
  public Types = {
    ObjectId: class {
      constructor(public id: string = '507f1f77bcf86cd799439011') {}
    }
  };
}


// Manual jest.Mocked<UserRepository> mock
const mockUserRepository = {
  find: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

describe('UserService.getAll() getAll method', () => {
  let userService: UserService;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    userService = new UserService(mockUserRepository as any);
  });

  // Happy Path Tests
  describe('Happy paths', () => {
    it('should return an array of users when users exist', async () => {
      // This test ensures getAll returns users as expected
      const mockUsers = [
        {
          _id: new (new Mockmongoose().Types.ObjectId)('60b8f4d5f8a3c3001f3e9a0e'),
          name: 'john doe',
          email: 'johndoe@tsoa.com',
          age: 21,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
        },
        {
          _id: new (new Mockmongoose().Types.ObjectId)('60b8f4d5f8a3c3001f3e9a0f'),
          name: 'jane doe',
          email: 'janedoe@tsoa.com',
          age: 22,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
        },
      ];
      jest.mocked(mockUserRepository.find).mockResolvedValue(mockUsers as any as never);

      const result = await userService.getAll();

      expect(mockUserRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array when no users exist', async () => {
      // This test ensures getAll returns an empty array if no users are found
      jest.mocked(mockUserRepository.find).mockResolvedValue([] as any as never);

      const result = await userService.getAll();

      expect(mockUserRepository.find).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });

    it('should call userRepository.find with an empty object as filter', async () => {
      // This test ensures the repository is called with the correct filter
      jest.mocked(mockUserRepository.find).mockResolvedValue([] as any as never);

      await userService.getAll();

      expect(mockUserRepository.find).toHaveBeenCalledWith({});
    });
  });

  // Edge Case Tests
  describe('Edge cases', () => {
    it('should handle users with missing optional fields gracefully', async () => {
      // This test ensures getAll can handle users with missing fields
      const mockUsers = [
        {
          _id: new (new Mockmongoose().Types.ObjectId)('60b8f4d5f8a3c3001f3e9a0e'),
          name: 'john doe',
          email: 'johndoe@tsoa.com',
          // age is missing
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
        },
        {
          _id: new (new Mockmongoose().Types.ObjectId)('60b8f4d5f8a3c3001f3e9a0f'),
          // name is missing
          email: 'janedoe@tsoa.com',
          age: 22,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
        },
      ];
      jest.mocked(mockUserRepository.find).mockResolvedValue(mockUsers as any as never);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
    });

    it('should propagate errors thrown by userRepository.find', async () => {
      // This test ensures getAll throws if the repository throws
      const error = new Error('Database failure');
      jest.mocked(mockUserRepository.find).mockRejectedValue(error as never);

      await expect(userService.getAll()).rejects.toThrow('Database failure');
      expect(mockUserRepository.find).toHaveBeenCalledWith({});
    });

    it('should handle users with extra unexpected fields', async () => {
      // This test ensures getAll can handle users with extra fields
      const mockUsers = [
        {
          _id: new (new Mockmongoose().Types.ObjectId)('60b8f4d5f8a3c3001f3e9a0e'),
          name: 'john doe',
          email: 'johndoe@tsoa.com',
          age: 21,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
          extraField: 'unexpected',
        },
      ];
      jest.mocked(mockUserRepository.find).mockResolvedValue(mockUsers as any as never);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
    });

    it('should handle users with non-standard _id types', async () => {
      // This test ensures getAll can handle users with _id as a string
      const mockUsers = [
        {
          _id: 'some-string-id',
          name: 'john doe',
          email: 'johndoe@tsoa.com',
          age: 21,
          createdAt: new Date('2023-01-01T10:00:00Z'),
          updatedAt: new Date('2023-01-01T11:30:00Z'),
        },
      ];
      jest.mocked(mockUserRepository.find).mockResolvedValue(mockUsers as any as never);

      const result = await userService.getAll();

      expect(result).toEqual(mockUsers);
    });
  });
});