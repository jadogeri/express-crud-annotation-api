
import { DataSource } from "typeorm";
import { UserRepository } from '../../../src/repositories/UserRepository.repository';


// UserRepository.repository.findById.spec.ts


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
class MockUser {
  public _id: string = '507f1f77bcf86cd799439011';
  public name: string = 'Test User';
  public email: string = 'test@example.com';
}

// --- Test Suite ---

describe('UserRepository.findById() findById method', () => {
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

  it('should return a user when a valid ObjectId is provided and user exists', async () => {
    // This test ensures that findById returns the user when found.
    const expectedUser = new MockUser() as any;
    jest.mocked(mockFindOne).mockResolvedValue(expectedUser as any as never);

    const result = await userRepository.findById(mockObjectId as any);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: mockObjectId } });
    expect(result).toBe(expectedUser);
  });

  it('should call findOne with the correct query object', async () => {
    // This test ensures that findById constructs the correct query for findOne.
    jest.mocked(mockFindOne).mockResolvedValue({} as any as never);

    await userRepository.findById(mockObjectId as any);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: mockObjectId } });
  });

  // --- Edge Case Tests ---

  it('should return undefined when no user is found for the given ObjectId', async () => {
    // This test ensures that findById returns undefined if no user is found.
    jest.mocked(mockFindOne).mockResolvedValue(undefined);

    const result = await userRepository.findById(mockObjectId as any);

    expect(result).toBeUndefined();
    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: mockObjectId } });
  });

  it('should handle ObjectId with a different string value', async () => {
    // This test ensures that findById works with any valid ObjectId value.
    const anotherObjectId = new Mockmongoose.Types.ObjectId('000000000000000000000001') as any;
    const expectedUser = { _id: '000000000000000000000001', name: 'Another User' } as any;
    jest.mocked(mockFindOne).mockResolvedValue(expectedUser as any as never);

    const result = await userRepository.findById(anotherObjectId as any);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: anotherObjectId } });
    expect(result).toBe(expectedUser);
  });

  it('should propagate errors thrown by findOne', async () => {
    // This test ensures that errors from findOne are not swallowed.
    const error = new Error('Database error');
    jest.mocked(mockFindOne).mockRejectedValue(error as never);

    await expect(userRepository.findById(mockObjectId as any)).rejects.toThrow('Database error');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: mockObjectId } });
  });

  it('should work with an ObjectId that has a custom toString implementation', async () => {
    // This test ensures that findById works even if ObjectId is customized.
    class CustomObjectId {
      public custom = true;
      toString() {
        return 'custom-object-id';
      }
    }
    const customObjectId = new CustomObjectId() as any;
    const expectedUser = { _id: 'custom-object-id', name: 'Custom User' } as any;
    jest.mocked(mockFindOne).mockResolvedValue(expectedUser as any as never);

    const result = await userRepository.findById(customObjectId as any);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { _id: customObjectId } });
    expect(result).toBe(expectedUser);
  });
});