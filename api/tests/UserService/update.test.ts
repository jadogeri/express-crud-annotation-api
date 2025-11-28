
import { CustomError } from "../../src/exceptions/CustomError.exception";
import { UserRepository } from "../../src/repositories/UserRepository.repository";
import { UserService } from '../../src/services/UserService.service';


// api/src/services/UserService.service.update.spec.ts
// --- Mocks ---

class MockObjectId {
  public id: string = '60b8f4d5f8a3c3001f3e9a0e';
  constructor(id?: string) {
    if (id) this.id = id;
  }
  toString() {
    return this.id;
  }
}

class MockUser {
  public _id: string = '60b8f4d5f8a3c3001f3e9a0e';
  public name: string = 'john doe';
  public email: string = 'johndoe@tsoa.com';
  public age: number = 21;
  public createdAt: Date = new Date('2023-01-01T10:00:00Z');
  public updatedAt: Date = new Date('2023-01-01T11:30:00Z');
}

class MockUpdateResult {
  public affected: number = 1;
}

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<UserRepository>;


// --- Tests ---

describe('UserService.update() update method', () => {
  let service: UserService;
  let mockMongoId: MockObjectId;
  let mockUser: MockUser;
  let mockUpdateResult: MockUpdateResult;

  beforeEach(() => {
    service = new UserService(mockUserRepository as any);
    mockMongoId = new MockObjectId('60b8f4d5f8a3c3001f3e9a0e') as any;
    mockUser = new MockUser() as any;
    mockUpdateResult = new MockUpdateResult() as any;

    jest.clearAllMocks();
  });

  // --- Happy Paths ---

  it('should update user successfully when all conditions are met', async () => {
    // This test ensures the user is updated when found, and no email/name conflicts exist.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // email not taken
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // name not taken
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 1 } as any);
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);

    const requestBody = {
      email: 'newemail@tsoa.com',
      name: 'new name',
      age: 22,
    } as any;

    const result = await service.update(mockMongoId as any, requestBody as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('newemail@tsoa.com');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('new name');
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
    expect(result).toEqual(mockUser as any);
  });

  it('should update user when only age is provided (no email/name checks)', async () => {
    // This test ensures that if only age is updated, no email/name checks are performed.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 1 } as any);
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);

    const requestBody = {
      age: 25,
    } as any;

    const result = await service.update(mockMongoId as any, requestBody as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
    expect(result).toEqual(mockUser as any);
  });

  it('should update user when only email is provided and not taken', async () => {
    // This test ensures that if only email is updated, and it's not taken, update proceeds.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // email not taken
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 1 } as any);
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);

    const requestBody = {
      email: 'unique@tsoa.com',
    } as any;

    const result = await service.update(mockMongoId as any, requestBody as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('unique@tsoa.com');
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
    expect(result).toEqual(mockUser as any);
  });

  it('should update user when only name is provided and not taken', async () => {
    // This test ensures that if only name is updated, and it's not taken, update proceeds.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // name not taken
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 1 } as any);
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);

    const requestBody = {
      name: 'unique name',
    } as any;

    const result = await service.update(mockMongoId as any, requestBody as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('unique name');
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
    expect(result).toEqual(mockUser as any);
  });

  // --- Edge Cases ---

  it('should throw CustomError(404) if user not found by id', async () => {
    // This test ensures that if the user is not found, a 404 error is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(null as any);

    const requestBody = {
      email: 'newemail@tsoa.com',
      name: 'new name',
      age: 22,
    } as any;

    await expect(service.update(mockMongoId as any, requestBody as any)).rejects.toThrow(
      new CustomError(404, `no user found with id '${mockMongoId}'`)
    );
    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
  });

  it('should throw CustomError(400) if email is already taken', async () => {
    // This test ensures that if the email is already taken, a 400 error is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser as any); // email taken

    const requestBody = {
      email: 'johndoe@tsoa.com',
    } as any;

    await expect(service.update(mockMongoId as any, requestBody as any)).rejects.toThrow(
      new CustomError(400, `user with email '${requestBody.email}' already exists`)
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('johndoe@tsoa.com');
  });

  it('should throw CustomError(400) if name is already taken', async () => {
    // This test ensures that if the name is already taken, a 400 error is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // email not taken
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(mockUser as any); // name taken

    const requestBody = {
      email: 'unique@tsoa.com',
      name: 'john doe',
    } as any;

    await expect(service.update(mockMongoId as any, requestBody as any)).rejects.toThrow(
      new CustomError(400, `user with name '${requestBody.name}' already exists`)
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('unique@tsoa.com');
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john doe');
  });

  it('should throw CustomError(500) if update result affected is not 1', async () => {
    // This test ensures that if the update does not affect any rows, a 500 error is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // email not taken
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // name not taken
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 0 } as any);

    const requestBody = {
      email: 'unique@tsoa.com',
      name: 'unique name',
      age: 22,
    } as any;

    await expect(service.update(mockMongoId as any, requestBody as any)).rejects.toThrow(
      new CustomError(500, ' Server error occured while updating')
    );
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
  });

  it('should handle update when requestBody is empty (no fields)', async () => {
    // This test ensures that if requestBody is empty, update is called with empty object.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.update).mockResolvedValueOnce({ affected: 1 } as any);
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);

    const requestBody = {} as any;

    const result = await service.update(mockMongoId as any, requestBody as any);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(mockMongoId as any);
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
    expect(result).toEqual(mockUser as any);
  });

  it('should throw CustomError(500) if update throws an error', async () => {
    // This test ensures that if the update method throws, a 500 error is thrown.
    jest.mocked(mockUserRepository.findById).mockResolvedValueOnce(mockUser as any);
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // email not taken
    jest.mocked(mockUserRepository.findByEmail).mockResolvedValueOnce(null as any); // name not taken
    jest.mocked(mockUserRepository.update).mockRejectedValueOnce(new Error('DB error') as never);

    const requestBody = {
      email: 'unique@tsoa.com',
      name: 'unique name',
      age: 22,
    } as any;

    await expect(service.update(mockMongoId as any, requestBody as any)).rejects.toThrow();
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockMongoId as any, requestBody as any);
  });
});