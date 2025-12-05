
import { IUserService } from "../../../src/interfaces/IUserService.interface";
import { UserController } from '../../../src/controllers/UserController.controller';


// Manual mock for mongoose
class Mockmongoose {
  public static isObjectIdOrHexString = jest.fn();
  public static Types = {
    ObjectId: jest.fn().mockImplementation((id: string) => {
      return { _id: id, toHexString: () => id } as any;
    }),
  };
}

// Manual mock for ObjectId (from mongodb)
class MockObjectId {
  public _id: string = 'mockedObjectId';
  constructor(id: string) {
    this._id = id;
  }
  public toHexString() {
    return this._id;
  }
}

// Mock for IUserService
class MockUserService implements IUserService {
  public create = jest.fn();
  public getOne = jest.fn();
  public getAll = jest.fn();
  public update = jest.fn();
  public delete = jest.fn();
}



// Manual mock for UserModificationResponse
interface MockUserModificationResponse {
  _id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

describe('UserController.deleteUser() deleteUser method', () => {
  let mockUserService: MockUserService;
  let userController: UserController;

  beforeEach(() => {
    // Mock IUserService with jest.fn()
    mockUserService = new MockUserService();


    // Instantiate controller with mocked service
    userController = new UserController(mockUserService as any);
    // Patch mongoose in controller context
    (userController as any).constructor.prototype.__proto__.mongoose = Mockmongoose as any;
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should delete a user when given a valid ObjectId string', async () => {
      // This test ensures that a valid userId results in a call to userService.delete and returns its result.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      // Simulate mongoose.isObjectIdOrHexString returning true
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);

      // Simulate ObjectId creation
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      // Simulate userService.delete returning a mock response
      const mockDeleteResponse: MockUserModificationResponse = {
        _id: validUserId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        createdAt: new Date('2024-01-01T12:00:00.000Z'),
        updatedAt: new Date('2024-01-01T13:00:00.000Z'),
      };
      jest.mocked(mockUserService.delete).mockResolvedValue(mockDeleteResponse as any);
     

      // Act
      const result = await userController.deleteUser(validUserId);

      // Assert
      expect(result).toEqual(mockDeleteResponse as any);
    });

    it('should propagate the userService.delete result', async () => {
      // This test ensures that whatever userService.delete returns is returned by the controller.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      const mockDeleteResponse: MockUserModificationResponse = {
        _id: validUserId,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        age: 25,
        createdAt: new Date('2024-02-01T12:00:00.000Z'),
        updatedAt: new Date('2024-02-01T13:00:00.000Z'),
      };
      jest.mocked(mockUserService.delete).mockResolvedValue(mockDeleteResponse as any as never);

      const result = await userController.deleteUser(validUserId);

      expect(result).toEqual(mockDeleteResponse as any);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return 400 and error message for invalid ObjectId string', async () => {
      // This test ensures that an invalid userId returns a 400 status and error message.

      const invalidUserId = 'not-a-valid-objectid';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(false as any);

      // Spy on setStatus
      const setStatusSpy = jest.spyOn(userController as any, 'setStatus').mockImplementation(() => {});

      const result = await userController.deleteUser(invalidUserId);

      expect(setStatusSpy).toHaveBeenCalledWith(400);
      expect(result).toEqual({ message: `id '${invalidUserId}' is not valid` });
      expect(mockUserService.delete).not.toHaveBeenCalled();
    });

    it('should handle userService.delete throwing an error', async () => {
      // This test ensures that if userService.delete throws, the error is propagated.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      const error = new Error('Delete failed');
      jest.mocked(mockUserService.delete).mockRejectedValue(error as never);

      await expect(userController.deleteUser(validUserId)).rejects.toThrow('Delete failed');

    });

    it('should handle userService.delete returning null (user not found)', async () => {
      // This test ensures that if userService.delete returns null, the controller returns null.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      jest.mocked(mockUserService.delete).mockResolvedValue(null as any as never);

      const result = await userController.deleteUser(validUserId);

      expect(result).toBeNull();
    });

    it('should handle userService.delete returning an error object', async () => {
      // This test ensures that if userService.delete returns an error object, it is returned by the controller.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      const errorObj = { error: 'User not found' };
      jest.mocked(mockUserService.delete).mockResolvedValue(errorObj as any as never);

      const result = await userController.deleteUser(validUserId);

      expect(result).toEqual(errorObj as any);
    });

    it('should handle userService.delete returning an empty object', async () => {
      // This test ensures that if userService.delete returns an empty object, it is returned by the controller.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      jest.mocked(mockUserService.delete).mockResolvedValue({} as any as never);

      const result = await userController.deleteUser(validUserId);

      expect(result).toEqual({} as any);
    });

    it('should handle userService.delete returning a string', async () => {
      // This test ensures that if userService.delete returns a string, it is returned by the controller.

      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      jest.mocked(Mockmongoose.Types.ObjectId).mockImplementation((id: string) => new MockObjectId(id) as any);

      jest.mocked(mockUserService.delete).mockResolvedValue('deleted' as any as never);

      const result = await userController.deleteUser(validUserId);

      expect(result).toBe('deleted');
    });
  });
});