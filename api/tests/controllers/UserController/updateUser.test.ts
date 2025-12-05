
import { CustomError } from "../../../src/exceptions/CustomError.exception";
import { IUserService } from "../../../src/interfaces/IUserService.interface";
import { UserUpdateBody } from "../../../src/types/UserType.type";
import { UserController } from '../../../src/controllers/UserController.controller';


// api/src/controllers/UserController.controller.updateUser.spec.ts
// --- Manual Mocks for dependencies ---

// Mock for mongoose
class Mockmongoose {
  public static isObjectIdOrHexString = jest.fn();
  public static Types = {
    ObjectId: jest.fn().mockImplementation((id: string) => {
      return { _id: id, toString: () => id };
    }),
  };
}

// Mock for ObjectId from mongodb
class MockObjectId {
  public _id: string;
  constructor(id: string) {
    this._id = id;
  }
  toString() {
    return this._id;
  }
}

// Mock for UserModificationResponse
interface MockUserModificationResponse {
  _id: any;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

// --- End of manual mocks ---

// Mock for IUserService
class MockUserService implements IUserService {
  public create = jest.fn();
  public getOne = jest.fn();
  public getAll = jest.fn();
  public update = jest.fn();
  public delete = jest.fn();
}

describe('UserController.updateUser() updateUser method', () => {
  let mockUserService: MockUserService;
  let controller: UserController;

  beforeEach(() => {
    
    mockUserService = new MockUserService();


    controller = new UserController(mockUserService as any);
    // Patch mongoose in the controller's scope
    (controller as any).constructor.prototype.__proto__.constructor.prototype.mongoose = Mockmongoose as any;
  });

  // --- Happy Path Tests ---

  it('should update user when valid userId and at least one field is supplied (all fields)', async () => {
    // This test ensures updateUser works with all fields present
    const userId = '60b8f4d5f8a3c3001f3e9a0e';
    const requestBody: UserUpdateBody = {
      name: 'Jane Doe',
      email: 'jane@tsoa.com',
      age: 30,
    } as any;

    // Mock mongoose.isObjectIdOrHexString to return true
    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);

    // Mock mongoose.Types.ObjectId to return a mock object
    (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

    // Mock userService.update to resolve with a mock response
    const mockResponse: MockUserModificationResponse = {
      _id: new MockObjectId(userId) as any,
      name: 'Jane Doe',
      email: 'jane@tsoa.com',
      age: 30,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T11:30:00Z'),
    };
    mockUserService.update.mockResolvedValue(mockResponse as any);

    const result = await controller.updateUser(userId, requestBody);

    expect(result).toEqual(mockResponse as any);
  });


  it('should update user when only one field (email) is supplied', async () => {
    // This test ensures updateUser works with only email present
    const userId = '60b8f4d5f8a3c3001f3e9a0e';
    const requestBody: UserUpdateBody = {
      email: 'jane@tsoa.com',
    } as any;

    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
    (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

    const mockResponse: MockUserModificationResponse = {
      _id: new MockObjectId(userId) as any,
      name: 'Jane Doe',
      email: 'jane@tsoa.com',
      age: 30,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T11:30:00Z'),
    };
    mockUserService.update.mockResolvedValue(mockResponse as any);

    const result = await controller.updateUser(userId, requestBody);

    expect(result).toEqual(mockResponse as any);
  });

  it('should update user when only one field (age) is supplied', async () => {
    // This test ensures updateUser works with only age present
    const userId = '60b8f4d5f8a3c3001f3e9a0e';
    const requestBody: UserUpdateBody = {
      age: 25,
    } as any;

    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
    (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

    const mockResponse: MockUserModificationResponse = {
      _id: new MockObjectId(userId) as any,
      name: 'Jane Doe',
      email: 'jane@tsoa.com',
      age: 25,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T11:30:00Z'),
    };
    mockUserService.update.mockResolvedValue(mockResponse as any);

    const result = await controller.updateUser(userId, requestBody);


    expect(result).toEqual(mockResponse as any);
  });

  // --- Edge Case Tests ---

  it('should throw CustomError if no fields are supplied in requestBody', async () => {
    // This test ensures updateUser throws if no fields are present
    const userId = '60b8f4d5f8a3c3001f3e9a0e';
    const requestBody: UserUpdateBody = {} as any;

    await expect(controller.updateUser(userId, requestBody)).rejects.toEqual(
      new CustomError(400, 'at least one field must be supplied') as any
    );
  });

  it('should return 400 and error message if userId is not a valid ObjectId', async () => {
    // This test ensures updateUser returns error for invalid userId
    const userId = 'invalid-object-id';
    const requestBody: UserUpdateBody = {
      name: 'Jane Doe',
    } as any;

    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(false as any);

    // Spy on setStatus to check if it is called with 400
    const setStatusSpy = jest.spyOn(controller as any, 'setStatus').mockImplementation(() => {});

    const result = await controller.updateUser(userId, requestBody);

    expect(setStatusSpy).toHaveBeenCalledWith(400);
    expect(result).toEqual({ message: `id '${userId}' is not valid` });
    setStatusSpy.mockRestore();
  });

  it('should propagate error if userService.update throws', async () => {
    // This test ensures updateUser propagates errors from userService.update
    const userId = '60b8f4d5f8a3c3001f3e9a0e';
    const requestBody: UserUpdateBody = {
      name: 'Jane Doe',
    } as any;

    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
    (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

    const error = new Error('Database error');
    mockUserService.update.mockRejectedValue(error as never);

    await expect(controller.updateUser(userId, requestBody)).rejects.toThrow('Database error');
  });

  it('should handle edge case where userId is a valid hex string but not a real ObjectId', async () => {
    // This test ensures updateUser works with a valid hex string that is not a real ObjectId
    const userId = '1234567890abcdef12345678'; // 24 hex chars
    const requestBody: UserUpdateBody = {
      name: 'Edge Case',
    } as any;

    jest.mocked(Mockmongoose.isObjectIdOrHexString).mockReturnValue(true as any);
    (Mockmongoose.Types.ObjectId as any).mockImplementation((id: string) => new MockObjectId(id) as any);

    const mockResponse: MockUserModificationResponse = {
      _id: new MockObjectId(userId) as any,
      name: 'Edge Case',
      email: 'edge@tsoa.com',
      age: 99,
      createdAt: new Date('2023-01-01T10:00:00Z'),
      updatedAt: new Date('2023-01-01T11:30:00Z'),
    };
    mockUserService.update.mockResolvedValue(mockResponse as any);

    const result = await controller.updateUser(userId, requestBody);

    expect(result).toEqual(mockResponse as any);
  });
});