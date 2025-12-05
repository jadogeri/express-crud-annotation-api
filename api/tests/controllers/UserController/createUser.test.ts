
import { IUserService } from "../../../src/interfaces/IUserService.interface";
import { UserCreationBody } from "../../../src/types/UserType.type";
import { UserController } from '../../../src/controllers/UserController.controller';


// UserController.controller.createUser.spec.ts
// Manual mocks for dependencies

class MockObjectId {
  private id: string;
  constructor(id?: string) {
    this.id = id || '507f1f77bcf86cd799439011';
  }
  toHexString() {
    return this.id;
  }
}



// Mock for UserCreationResponse
interface MockUserCreationResponse {
  _id: MockObjectId;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock for CustomError
class MockCustomError extends Error {
  public status: number = 400;
  constructor(message: string, status?: number) {
    super(message);
    if (status) this.status = status;
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

describe('UserController.createUser() createUser method', () => {
  let mockUserService: MockUserService;
  let userController: UserController;

  beforeEach(() => {
    mockUserService = new MockUserService();
    userController = new UserController(mockUserService as any);
  });

  // ========== HAPPY PATHS ==========

  it('should create a user successfully with valid input', async () => {
    // This test ensures that a valid user is created and returned as expected.
    const requestBody: UserCreationBody = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
    };

    const mockResponse: MockUserCreationResponse = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0e'),
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 30,
      createdAt: new Date('2024-01-01T12:00:00.000Z'),
      updatedAt: new Date('2024-01-01T13:00:00.000Z'),
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });

  it('should create a user with minimum valid age (edge of allowed range)', async () => {
    // This test ensures that a user with the minimum allowed age is created successfully.
    const requestBody: UserCreationBody = {
      name: 'Baby User',
      email: 'baby.user@example.com',
      age: 0,
    };

    const mockResponse: MockUserCreationResponse = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a0f'),
      name: 'Baby User',
      email: 'baby.user@example.com',
      age: 0,
      createdAt: new Date('2024-01-02T12:00:00.000Z'),
      updatedAt: new Date('2024-01-02T13:00:00.000Z'),
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });

  it('should create a user with a long name and unusual but valid email', async () => {
    // This test ensures that the controller can handle long names and valid but unusual emails.
    const requestBody: UserCreationBody = {
      name: 'A'.repeat(255),
      email: 'user+alias@sub.domain.example.com',
      age: 25,
    };

    const mockResponse: MockUserCreationResponse = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a10'),
      name: 'A'.repeat(255),
      email: 'user+alias@sub.domain.example.com',
      age: 25,
      createdAt: new Date('2024-01-03T12:00:00.000Z'),
      updatedAt: new Date('2024-01-03T13:00:00.000Z'),
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });

  // ========== EDGE CASES ==========

  it('should propagate errors thrown by the userService.create method', async () => {
    // This test ensures that if the service throws an error, it is propagated.
    const requestBody: UserCreationBody = {
      name: 'Error User',
      email: 'error.user@example.com',
      age: 22,
    };

    const error = new MockCustomError('Service error', 500);

    jest.mocked(mockUserService.create).mockRejectedValue(error as never);

    await expect(userController.createUser(requestBody)).rejects.toThrow('Service error');
    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
  });

  it('should handle service returning a user with missing optional fields (simulate partial response)', async () => {
    // This test ensures that the controller can handle a response with missing optional fields.
    // In this case, all fields are required, but we simulate a missing updatedAt for robustness.
    const requestBody: UserCreationBody = {
      name: 'Partial User',
      email: 'partial.user@example.com',
      age: 40,
    };

    const mockResponse: Partial<MockUserCreationResponse> = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a11'),
      name: 'Partial User',
      email: 'partial.user@example.com',
      age: 40,
      createdAt: new Date('2024-01-04T12:00:00.000Z'),
      // updatedAt is missing
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });

  it('should handle service returning a user with special characters in name and email', async () => {
    // This test ensures that special characters in name and email are handled.
    const requestBody: UserCreationBody = {
      name: 'Jöhn Dœ!@#$%^&*()_+',
      email: 'jöhn.dœ+test@exämple.com',
      age: 28,
    };

    const mockResponse: MockUserCreationResponse = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a12'),
      name: 'Jöhn Dœ!@#$%^&*()_+',
      email: 'jöhn.dœ+test@exämple.com',
      age: 28,
      createdAt: new Date('2024-01-05T12:00:00.000Z'),
      updatedAt: new Date('2024-01-05T13:00:00.000Z'),
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });

  it('should handle service returning a user with a very large age', async () => {
    // This test ensures that the controller can handle a user with a very large age value.
    const requestBody: UserCreationBody = {
      name: 'Old User',
      email: 'old.user@example.com',
      age: 150,
    };

    const mockResponse: MockUserCreationResponse = {
      _id: new MockObjectId('60b8f4d5f8a3c3001f3e9a13'),
      name: 'Old User',
      email: 'old.user@example.com',
      age: 150,
      createdAt: new Date('2024-01-06T12:00:00.000Z'),
      updatedAt: new Date('2024-01-06T13:00:00.000Z'),
    };

    jest.mocked(mockUserService.create).mockResolvedValue(mockResponse as any);

    const result = await userController.createUser(requestBody);

    expect(mockUserService.create).toHaveBeenCalledWith(requestBody);
    expect(result).toEqual(mockResponse as any);
  });
});