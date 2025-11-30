
import { CustomError } from "../../../src/exceptions/CustomError.exception";
import { UserRepository } from "../../../src/repositories/UserRepository.repository";
import { UserService } from '../../../src/services/UserService.service';


// UserService.service.getOne.spec.ts
// --- Mocks ---

// Mock for mongoose.Types.ObjectId
class MockObjectId {
  public id: string = '60b8f4d5f8a3c3001f3e9a0e';
  constructor(id?: string) {
    if (id) this.id = id;
  }
  toString() {
    return this.id;
  }
}

// Mock for mongoose

// Mock for UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

// --- Test Data ---
const mockUserData = {
  _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0e'),
  name: 'john doe',
  email: 'johndoe@tsoa.com',
  age: 21,
  createdAt: new Date('2023-01-01T10:00:00Z'),
  updatedAt: new Date('2023-01-01T11:30:00Z'),
} as any;

// --- Tests ---
describe('UserService.getOne() getOne method', () => {
  let service: UserService;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    service = new UserService(mockUserRepository as any);
  });

  // --- Happy Paths ---
  describe('Happy paths', () => {
    it('should return the user when found by id', async () => {
      // This test ensures that getOne returns the user object when found.
      jest.mocked(mockUserRepository.findById).mockResolvedValue(mockUserData as any as never);

      const mockId = new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any;
      const result = await service.getOne(mockId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockUserData);
    });

    it('should handle users with minimal fields (edge of valid user)', async () => {
      // This test ensures that getOne works with a user object with only required fields.
      const minimalUser = {
        _id: new MockObjectId('111111111111111111111111'),
        name: 'Jane',
        email: 'jane@example.com',
        age: 18,
      } as any;

      jest.mocked(mockUserRepository.findById).mockResolvedValue(minimalUser as any as never);

      const mockId = new MockObjectId('111111111111111111111111') as any;
      const result = await service.getOne(mockId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(minimalUser);
    });

    it('should handle users with extra fields (robustness)', async () => {
      // This test ensures that getOne works even if the user object has extra fields.
      const extraUser = {
        ...mockUserData,
        extraField: 'extra',
        anotherField: 123,
      } as any;

      jest.mocked(mockUserRepository.findById).mockResolvedValue(extraUser as any as never);

      const mockId = new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any;
      const result = await service.getOne(mockId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(extraUser);
    });
  });

  // --- Edge Cases ---
  describe('Edge cases', () => {
    it('should throw CustomError(404) if user is not found', async () => {
      // This test ensures that getOne throws a CustomError when no user is found.
      jest.mocked(mockUserRepository.findById).mockResolvedValue(null as any as never);

      const mockId = new MockObjectId('notfoundid') as any;

      await expect(service.getOne(mockId)).rejects.toThrow(CustomError);
      await expect(service.getOne(mockId)).rejects.toMatchObject({
        statusCode: 404,
        message: `no user found with id '${mockId}'`,
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
    });

    it('should throw CustomError with correct message for unusual ObjectId', async () => {
      // This test ensures that getOne throws a CustomError with the correct message for a weird ObjectId.
      jest.mocked(mockUserRepository.findById).mockResolvedValue(null as any as never);

      const weirdId = new MockObjectId('000000000000000000000000') as any;

      await expect(service.getOne(weirdId)).rejects.toThrow(CustomError);
      await expect(service.getOne(weirdId)).rejects.toMatchObject({
        statusCode: 404,
        message: `no user found with id '${weirdId}'`,
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(weirdId);
    });

    it('should propagate repository errors', async () => {
      // This test ensures that getOne propagates errors thrown by the repository.
      const repoError = new Error('DB failure');
      jest.mocked(mockUserRepository.findById).mockRejectedValue(repoError as never);

      const mockId = new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any;

      await expect(service.getOne(mockId)).rejects.toThrow('DB failure');
      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
    });

    it('should work with ObjectId instances with custom toString', async () => {
      // This test ensures that getOne works with ObjectId instances that override toString.
      const customId = new MockObjectId('customid') as any;
      customId.toString = () => 'customidstring';

      jest.mocked(mockUserRepository.findById).mockResolvedValue(mockUserData as any as never);

      const result = await service.getOne(customId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(customId);
      expect(result).toEqual(mockUserData);
    });
  });
});