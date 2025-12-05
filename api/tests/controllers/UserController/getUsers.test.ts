
import { UserController } from '../../../src/controllers/UserController.controller';


// UserController.controller.getUsers.spec.ts
// --- Manual Mocks for dependencies ---

// Mock for mongoose.Types.ObjectId

// Mock for ObjectId from mongodb
class MockObjectId {
  private id: string;
  constructor(id: string = '60b8f4d5f8a3c3001f3e9a0e') {
    this.id = id;
  }
  toHexString() {
    return this.id;
  }
}

// Mock for UserReadResponse
interface MockUserReadResponse {
  _id: MockObjectId;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}





// --- End of manual mocks ---

describe('UserController.getUsers() getUsers method', () => {
  let mockUserService: {
    getAll: jest.Mock;
  };
  let controller: UserController;

  beforeEach(() => {
    mockUserService = {
      getAll: jest.fn(),
    };
    controller = new UserController(mockUserService as any);
  });

  // --- Happy Path Tests ---

  it('should return a list of users when users exist (happy path)', async () => {
    // This test ensures that getUsers returns a list of users as expected.
    const mockUsers: MockUserReadResponse[] = [
      {
        _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any,
        name: 'john doe',
        email: 'johndoe@tsoa.com',
        age: 21,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T11:30:00Z'),
      },
      {
        _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0f') as any,
        name: 'jane doe',
        email: 'janedoe@tsoa.com',
        age: 22,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T11:30:00Z'),
      },
    ];
    jest.mocked(mockUserService.getAll).mockResolvedValue(mockUsers as any);

    const result = await controller.getUsers();

    expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers as any);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('john doe');
    expect(result[1].email).toBe('janedoe@tsoa.com');
  });

  it('should return an empty array when no users exist (happy path)', async () => {
    // This test ensures that getUsers returns an empty array if there are no users.
    jest.mocked(mockUserService.getAll).mockResolvedValue([] as any);

    const result = await controller.getUsers();

    expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should return users with all expected fields (happy path)', async () => {
    // This test ensures that all expected fields are present in the returned user objects.
    const now = new Date();
    const mockUsers: MockUserReadResponse[] = [
      {
        _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any,
        name: 'Alice',
        email: 'alice@example.com',
        age: 30,
        createdAt: now,
        updatedAt: now,
      },
    ];
    jest.mocked(mockUserService.getAll).mockResolvedValue(mockUsers as any);

    const result = await controller.getUsers();

    expect(result[0]).toHaveProperty('_id');
    expect(result[0]).toHaveProperty('name', 'Alice');
    expect(result[0]).toHaveProperty('email', 'alice@example.com');
    expect(result[0]).toHaveProperty('age', 30);
    expect(result[0]).toHaveProperty('createdAt', now);
    expect(result[0]).toHaveProperty('updatedAt', now);
  });

  // --- Edge Case Tests ---

  it('should handle users with edge-case values (edge case)', async () => {
    // This test ensures that getUsers can handle users with edge-case values (e.g., age 0, empty name).
    const now = new Date();
    const mockUsers: MockUserReadResponse[] = [
      {
        _id: new MockObjectId('000000000000000000000000') as any,
        name: '',
        email: 'emptyname@example.com',
        age: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: new MockObjectId('ffffffffffffffffffffffff') as any,
        name: 'Max Age',
        email: 'maxage@example.com',
        age: Number.MAX_SAFE_INTEGER,
        createdAt: now,
        updatedAt: now,
      },
    ];
    jest.mocked(mockUserService.getAll).mockResolvedValue(mockUsers as any);

    const result = await controller.getUsers();

    expect(result.length).toBe(2);
    expect(result[0].name).toBe('');
    expect(result[0].age).toBe(0);
    expect(result[1].age).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should propagate errors thrown by userService.getAll (edge case)', async () => {
    // This test ensures that if userService.getAll throws, the error is propagated.
    const error = new Error('Database failure');
    jest.mocked(mockUserService.getAll).mockRejectedValue(error as never);

    await expect(controller.getUsers()).rejects.toThrow('Database failure');
    expect(mockUserService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should handle userService.getAll returning non-array (edge case)', async () => {
    // This test ensures that if userService.getAll returns a non-array, it is returned as-is.
    // (This is an edge case for defensive programming, not expected in normal operation.)
    const mockReturn = { not: 'an array' };
    jest.mocked(mockUserService.getAll).mockResolvedValue(mockReturn as any);

    const result = await controller.getUsers();

    expect(result).toEqual(mockReturn as any);
  });

  it('should handle user objects with missing optional fields (edge case)', async () => {
    // This test ensures that getUsers can handle user objects missing optional fields.
    // (Assuming all fields are required, but for robustness, test missing fields.)
    const now = new Date();
    // @ts-ignore: purposely omitting 'updatedAt'
    const mockUsers: Partial<MockUserReadResponse>[] = [
      {
        _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any,
        name: 'No Update',
        email: 'noupdate@example.com',
        age: 25,
        createdAt: now,
      },
    ];
    jest.mocked(mockUserService.getAll).mockResolvedValue(mockUsers as any);

    const result = await controller.getUsers();

    expect(result[0].name).toBe('No Update');
    expect(result[0].updatedAt).toBeUndefined();
  });
});