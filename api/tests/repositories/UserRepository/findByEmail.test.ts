
import { DataSource } from "typeorm";
import { User } from "../../../src/entities/User.entity";
import { UserRepository } from '../../../src/repositories/UserRepository.repository';


// UserRepository.repository.findById.spec.ts


// UserRepository.repository.findById.spec.ts
// --- Mocks for external dependencies ---

// Mock for mongoose.Types.ObjectId

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

describe('UserRepository.findByEmail() findByEmail method', () => {
  let userRepository: UserRepository;
  let mockFindOne: jest.Mock;
  beforeEach(() => {
   // Setup: mock createEntityManager to return our mockEntityManager
    jest.mocked(mockDataSource.createEntityManager).mockReturnValue(mockEntityManager as any);

    // Create UserRepository instance with mocked DataSource
    userRepository = new UserRepository(mockDataSource as any);

    // Spy on the inherited findOne method
    mockFindOne = jest.fn();
    // @ts-ignore: override protected method for testing
    userRepository.findOne = mockFindOne;
  });

  // --- Happy Path Tests ---

  it('should return a User object when a user with the given email exists', async () => {
    // This test ensures that findByEmail returns the user when found.

    const expectedUser = new MockUser() as any;
    jest.mocked(mockFindOne).mockResolvedValue(expectedUser as any as never);

    const result = await userRepository.findByEmail('test@example.com');

    expect(mockFindOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(result).toBe(expectedUser);

    
  });

  it('should call findOne with the correct email in the where clause', async () => {
    // This test ensures that the correct query is constructed.
    jest.mocked(mockFindOne).mockResolvedValue({} as any as never);

    await userRepository.findByEmail('another@example.com');

    expect(mockFindOne).toHaveBeenCalledWith({ where: { email : 'another@example.com' } });
  });

  // --- Edge Case Tests ---

  it('should return null when no user with the given email exists', async () => {
    // This test ensures that null is returned if no user is found.
    jest.mocked(mockFindOne).mockResolvedValue(null as any as never);

    const result = await userRepository.findByEmail('notfound@example.com');

    expect(result).toBeNull();
  });

  it('should handle emails with unusual but valid characters', async () => {
    // This test ensures that emails with special characters are handled.
    const specialEmail = 'user+filter@sub.domain-example.com';
    const mockUser: User = {
      id: '456',
      email: specialEmail,
      name: 'Special User',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any as never);

    const result = await userRepository.findByEmail(specialEmail);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { email : specialEmail } });
    expect(result).toBe(mockUser);
  });

  it('should handle empty string as email and return null', async () => {
    // This test ensures that an empty string email returns null.
    jest.mocked(mockFindOne).mockResolvedValue(null as any as never);

    const result = await userRepository.findByEmail('');

    expect(mockFindOne).toHaveBeenCalledWith({ where: { email: '' } });
    expect(result).toBeNull();
  });

  it('should handle very long email addresses', async () => {
    // This test ensures that very long emails are handled.
    const longEmail = 'a'.repeat(200) + '@example.com';
    const mockUser: User = {
      id: '789',
      email: longEmail,
      name: 'Long Email User',
    } as any;

    jest.mocked(mockFindOne).mockResolvedValue(mockUser as any );

    const result = await userRepository.findByEmail(longEmail);

    expect(mockFindOne).toHaveBeenCalledWith({ where: { email: longEmail } });
    expect(result).toBe(mockUser);
  });


});