
import { DataSource } from "typeorm";
import { UserRepository } from '../../../src/repositories/UserRepository.repository';



// UserRepository.repository.findById.spec.ts
// --- Mocks for external dependencies ---

// Mock for mongoose.Types.ObjectId
class Mockmongoose {
  public static Types = {
    ObjectId: class {
      private _id: string;
      constructor(id: string) {
        this._id = id;
      }
      toString() {
        return this._id;
      }
    }
  };
}

// Mock for DataSource
const mockDataSource = {
  createEntityManager: jest.fn(),
} as unknown as jest.Mocked<DataSource>;

// Mock for EntityManager (used by BaseRepository)
const mockEntityManager = {
  // Add any methods if needed in future
} as any;

// Mock for User entity
type MockUser = {
   _id: string 
   name: string ;
   email: string ;
}

// --- Test Suite ---

describe('UserRepository.findByName() findByName method', () => {
  let userRepository: UserRepository;
  let mockFindOne: jest.Mock;
  let mockObjectId: InstanceType<typeof Mockmongoose.Types.ObjectId>;

  beforeEach(() => {
    // Setup: mock createEntityManager to return our mockEntityManager
    jest.mocked(mockDataSource.createEntityManager).mockReturnValue(mockEntityManager as any);

    // Create UserRepository instance with mocked DataSource
    userRepository = new UserRepository(mockDataSource as any);

    // Spy on the inherited findOne method
    mockFindOne = jest.fn();
    // @ts-ignore: override protected method for testing
    userRepository.findOne = mockFindOne;

    // Create a mock ObjectId
    mockObjectId = new Mockmongoose.Types.ObjectId('507f1f77bcf86cd799439011') as any;
  });

  // --- Happy Path Tests ---

  it('should return a User object when a user with the given name exists', async () => {
    // This test ensures that findByName returns the correct User when found.
    const mockUser: MockUser = {
      id: '123',
      name: 'Alice',
      email: 'alice@example.com',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any as never);

    const result = await userRepository.findByName('Alice');

    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: 'Alice' } });
    expect(result).toEqual(mockUser);
  });

  it('should call findOne with the correct query object', async () => {
    // This test ensures that the query object is constructed as expected.
    jest.mocked(mockFindOne).mockResolvedValue({} as any as never);

    await userRepository.findByName('Bob');

    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: 'Bob' } });
  });

  // --- Edge Case Tests ---

  it('should return null when no user with the given name exists', async () => {
    // This test ensures that null is returned if no user is found.
    jest.mocked(mockFindOne).mockResolvedValue(null);

    const result = await userRepository.findByName('NonExistentUser');

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: 'NonExistentUser' } });
  });

  it('should handle empty string as name and return null if not found', async () => {
    // This test checks behavior when an empty string is provided as the name.
    jest.mocked(mockFindOne).mockResolvedValue(null);

    const result = await userRepository.findByName('');

    expect(result).toBeNull();
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: '' } });
  });

  it('should handle special characters in the name', async () => {
    // This test checks that special characters in the name are handled.
    const specialName = '!@#$%^&*()_+|}{":?><,./;\'[]\\=-`~';
    const mockUser: MockUser = {
      id: '456',
      name: specialName,
      email: 'special@example.com',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any as never);

    const result = await userRepository.findByName(specialName);

    expect(result).toEqual(mockUser);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: specialName } });
  });

  it('should throw an error if the underlying findOne throws', async () => {
    // This test ensures that errors from findOne are propagated.
    const error = new Error('Database failure');
    jest.mocked(mockFindOne).mockRejectedValue(error as never);

    await expect(userRepository.findByName('ErrorUser')).rejects.toThrow('Database failure');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: 'ErrorUser' } });
  });

  it('should handle names with leading/trailing whitespace', async () => {
    // This test checks that names with whitespace are passed as-is.
    const nameWithSpaces = '  John Doe  ';
    const mockUser: MockUser = {
      id: '789',
      name: nameWithSpaces,
      email: 'john@example.com',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any as never);

    const result = await userRepository.findByName(nameWithSpaces);

    expect(result).toEqual(mockUser);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: nameWithSpaces } });
  });

  it('should handle very long names', async () => {
    // This test checks that very long names are handled.
    const longName = 'a'.repeat(1000);
    const mockUser: MockUser = {
      id: '1000',
      name: longName,
      email: 'long@example.com',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any as never);

    const result = await userRepository.findByName(longName);

    expect(result).toEqual(mockUser);
    expect(mockFindOne).toHaveBeenCalledWith({ where: { name: longName } });
  });
});