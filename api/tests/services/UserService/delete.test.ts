
import { CustomError } from "../../../src/exceptions/CustomError.exception";
import { UserRepository } from "../../../src/repositories/UserRepository.repository";
import { UserService } from '../../../src/services/UserService.service';


// UserService.service.delete.spec.ts


// UserService.service.delete.spec.ts
// --- Mocks ---

// Mock for mongoose.Types.ObjectId
class MockObjectId {
  private _id: string;
  constructor(id: string = '507f1f77bcf86cd799439011') {
    this._id = id;
  }
  toString(): string {
    return this._id;
  }
}

// Mock for mongoose
class Mockmongoose {
  static Types = {
    ObjectId: MockObjectId,
  };
}

// Mock for UserRepository
const mockUserRepository = {
  findById: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;

// --- Test Suite ---

describe('UserService.delete() delete method', () => {
  let userService: UserService;
  let mockObjectId: MockObjectId;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    userService = new UserService(mockUserRepository as any);
    mockObjectId = new Mockmongoose.Types.ObjectId('507f1f77bcf86cd799439011') as any;
  });

  // --- Happy Paths ---

  it('should delete a user successfully when user exists and delete is successful (affected === 1)', async () => {
    // This test ensures that when a user is found and delete returns affected === 0, the correct success message is returned.
    const foundUser = { _id: mockObjectId, name: 'John Doe', email: 'john@example.com', age: 30 };
    jest.mocked(mockUserRepository.findById).mockResolvedValue(foundUser as any as never);
    jest.mocked(mockUserRepository.delete).mockResolvedValue({ affected: 1 } as any as never);

    const result = await userService.delete(mockObjectId as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(mockObjectId as any);
    expect(result).toEqual({
      message: `successfully deleted user with id '${mockObjectId.toString()}'`,
    });
  });

  // --- Edge Cases ---

  it('should throw CustomError(404) if user is not found', async () => {
    // This test ensures that if the user is not found, a CustomError with status 404 is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValue(undefined as any as never);

    await expect(userService.delete(mockObjectId as any)).rejects.toEqual(
      new CustomError(404, `no user found with id '${mockObjectId}'`)
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });

  it('should return success message even if delete.affected is 1 (edge: user existed but deleted)', async () => {
    // This test ensures that if delete.affected is 1, the method still returns a success message.
    const foundUser = { _id: mockObjectId, name: 'Jane Doe', email: 'jane@example.com', age: 25 };
    jest.mocked(mockUserRepository.findById).mockResolvedValue(foundUser as any as never);
    jest.mocked(mockUserRepository.delete).mockResolvedValue({ affected: 1 } as any as never);

    const result = await userService.delete(mockObjectId as any);

    expect(result).toEqual({
      message: `successfully deleted user with id '${mockObjectId.toString()}'`,
    });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(mockObjectId as any);
  });

    it('should return failure message even if delete.affected is not 0 (edge: user existed but nothing deleted)', async () => {
    // This test ensures that if delete.affected is 0, the method still returns a success message.
    const foundUser = { _id: mockObjectId, name: 'Jane Doe', email: 'jane@example.com', age: 25, text: 1 };
    jest.mocked(mockUserRepository.findById).mockResolvedValue(foundUser as any as never);
    jest.mocked(mockUserRepository.delete).mockResolvedValue({ affected: 0 } as any as never);

    const result = await userService.delete(mockObjectId as any);

    expect(result).toEqual({
      message: `failed to delete user with id '${mockObjectId.toString()}'`,
    });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(mockObjectId as any);
  });


  it('should propagate errors thrown by userRepository.findById', async () => {
    // This test ensures that if findById throws an error, it is propagated.
    const error = new Error('DB error');
    jest.mocked(mockUserRepository.findById).mockRejectedValue(error as never);

    await expect(userService.delete(mockObjectId as any)).rejects.toThrow('DB error');
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate errors thrown by userRepository.delete', async () => {
    // This test ensures that if delete throws an error, it is propagated.
    const foundUser = { _id: mockObjectId, name: 'Error User', email: 'error@example.com', age: 50 };
    jest.mocked(mockUserRepository.findById).mockResolvedValue(foundUser as any as never);
    const error = new Error('Delete failed');
    jest.mocked(mockUserRepository.delete).mockRejectedValue(error as never);

    await expect(userService.delete(mockObjectId as any)).rejects.toThrow('Delete failed');
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockObjectId as any);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(mockObjectId as any);
  });

  it('should work with ObjectId having custom toString implementation (edge: toString returns different value)', async () => {
    // This test ensures that if ObjectId's toString returns a custom value, the message reflects it.
    class CustomObjectId extends MockObjectId {
      toString() {
        return 'custom-object-id';
      }
    }
    const customObjectId = new CustomObjectId() as any;
    const foundUser = { _id: customObjectId, name: 'Custom', email: 'custom@example.com', age: 60 };
    jest.mocked(mockUserRepository.findById).mockResolvedValue(foundUser as any as never);
    jest.mocked(mockUserRepository.delete).mockResolvedValue({ affected: 0 } as any as never);

    const result = await userService.delete(customObjectId as any);

    expect(result).toEqual({
      message: `failed to delete user with id 'custom-object-id'`,
    });
    expect(mockUserRepository.findById).toHaveBeenCalledWith(customObjectId as any);
    expect(mockUserRepository.delete).toHaveBeenCalledWith(customObjectId as any);
  });
});