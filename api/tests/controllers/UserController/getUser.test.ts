
import { IUserService } from "../../../src/interfaces/IUserService.interface";
import { UserController } from '../../../src/controllers/UserController.controller';


// UserController.controller.getUser.spec.ts
// --- Manual Mocks for dependencies ---

// Mock for mongoose and its nested properties
class Mockmongoose {
  public static isObjectIdOrHexString = jest.fn();
  public static Types = {
    ObjectId: jest.fn().mockImplementation((id: string) => {
      return { _id: id, toHexString: () => id };
    }),
  };
}

// Mock for ObjectId from mongodb
class MockObjectId {
  public _id: string;
  constructor(id: string) {
    this._id = id;
  }
  toHexString() {
    return this._id;
  }
}

// Mock for UserReadResponse
interface MockUserReadResponse {
  _id: any;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}



// --- End of manual mocks ---

describe('UserController.getUser() getUser method', () => {
  // Common variables for all tests
  let mockUserService: jest.Mocked<IUserService>;
  let controller: UserController;

  beforeEach(() => {
    jest.restoreAllMocks()
    mockUserService = {
      create: jest.fn(),
      getOne: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    controller = new UserController(mockUserService as any);
    // Patch mongoose in controller's scope
    (controller as any).constructor.prototype.mongoose = Mockmongoose as any;
  });

  // --- Happy Path Tests ---
  describe('Happy Paths', () => {
    it('should return user details for a valid ObjectId string', async () => {
      // This test aims to verify that a valid userId returns the user details from the service.
      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      // Simulate mongoose.isObjectIdOrHexString returns true
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);

      // Simulate mongoose.Types.ObjectId returns a mock object
      (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

      // Prepare a mock user response
      const mockUser: MockUserReadResponse = {
        _id: new MockObjectId(validUserId) as any,
        name: 'john doe',
        email: 'johndoe@tsoa.com',
        age: 21,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T11:30:00Z'),
      };

      // Mock userService.getOne to resolve with the mock user
      jest.mocked(mockUserService.getOne).mockResolvedValue(mockUser as any);

      // Act
      const result = await controller.getUser(validUserId);

      // Assert

      expect(result).toEqual(mockUser);

    });

    it('should call setStatus(400) and return error message for invalid ObjectId', async () => {
      // This test aims to verify that an invalid userId triggers a 400 error and returns the correct error message.
      const invalidUserId = 'not-a-valid-objectid';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(false as any);

      // Spy on setStatus
      const setStatusSpy = jest.spyOn(controller as any, 'setStatus').mockImplementation(() => {});

      // Act
      const result = await controller.getUser(invalidUserId);

      // Assert
      expect(setStatusSpy).toHaveBeenCalledWith(400);
      expect(result).toEqual({ message: `id '${invalidUserId}' is not valid` });
      expect(mockUserService.getOne).not.toHaveBeenCalled();
    });

    it('should handle userService.getOne returning null (user not found)', async () => {
      // This test aims to verify that if the user is not found, the controller returns null or whatever the service returns.
      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

      jest.mocked(mockUserService.getOne).mockResolvedValue(null as any);

      const result = await controller.getUser(validUserId);

      //expect(mockUserService.getOne).toHaveBeenCalledWith(expect.objectContaining({ _id: validUserId }));
      expect(result).toBeNull();
    });
  });

  // --- Edge Case Tests ---
  describe('Edge Cases', () => {
    it('should handle userId with leading/trailing spaces', async () => {
      // This test aims to verify that userId with spaces is handled correctly.
      const userIdWithSpaces = ' 60b8f4d5f8a3c3001f3e9a0e ';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(false as any);

      const setStatusSpy = jest.spyOn(controller as any, 'setStatus').mockImplementation(() => {});

      const result = await controller.getUser(userIdWithSpaces);

      expect(setStatusSpy).toHaveBeenCalledWith(400);
      expect(result).toEqual({ message: `id '${userIdWithSpaces}' is not valid` });
      expect(mockUserService.getOne).not.toHaveBeenCalled();
    });

    it('should propagate errors thrown by userService.getOne', async () => {
      // This test aims to verify that if userService.getOne throws, the error is propagated.
      const validUserId = '60b8f4d5f8a3c3001f3e9a0e';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
      (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

      const error = new Error('Database error');
      jest.mocked(mockUserService.getOne).mockRejectedValue(error as never);

      await expect(controller.getUser(validUserId)).rejects.toThrow('Database error');
    });

    it('should handle userId with special characters', async () => {
      // This test aims to verify that userId with special characters is rejected.
      const specialCharUserId = '!@#$%^&*()_+';
      jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(false as any);

      const setStatusSpy = jest.spyOn(controller as any, 'setStatus').mockImplementation(() => {});

      const result = await controller.getUser(specialCharUserId);

      expect(setStatusSpy).toHaveBeenCalledWith(400);
      expect(result).toEqual({ message: `id '${specialCharUserId}' is not valid` });
      expect(mockUserService.getOne).not.toHaveBeenCalled();
    });

  });
});


