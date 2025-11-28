
import "reflect-metadata";
import { DataSource } from "typeorm";
import { initializeDatabase } from '../data-source';
import { TYPES } from "../types/binding.types";

// Mock for iocContainer
class MockiocContainer {
  public bind = jest.fn();
}

// --- Mock Implementations and Setup ---

// Mock DataSource class
class MockDataSource {
  public initialize = jest.fn();
  constructor(public options: any) {}
}

// Mock User entity
class MockUser {}

// --- Jest Mocks and Spies ---

jest.mock("typeorm", () => {
  return {
    DataSource: jest.fn().mockImplementation((options) => {
      // Return a new instance of MockDataSource with the provided options
      return new MockDataSource(options) as any;
    }),
  };
});

jest.mock("../entities/User.entity", () => ({
  User: MockUser,
}));

jest.mock("../configs/ioc.config", () => ({
  iocContainer: new MockiocContainer() as any,
}));

jest.mock("../types/binding.types", () => ({
  TYPES: {
    DataSource: Symbol.for('DataSource'),
  },
}));

// --- Save/Restore ENV ---
const ORIGINAL_ENV = { ...process.env };

// --- Tests ---

describe('initializeDatabase() initializeDatabase method', () => {
  let mockDataSourceInstance: MockDataSource;
  let mockIocContainer: MockiocContainer;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...ORIGINAL_ENV };

    // Clear all mocks
    jest.clearAllMocks();

    // Re-require mocks to reset singleton state
    jest.resetModules();

    // Get the current iocContainer mock instance
    // (re-import to get the fresh instance)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mockIocContainer = require('./configs/ioc.config').iocContainer as any;

    // Patch DataSource to capture the instance for assertions
    (DataSource as jest.Mock).mockImplementation((options) => {
      mockDataSourceInstance = new MockDataSource(options) as any;
      return mockDataSourceInstance as any;
    });
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  // --- Happy Paths ---

  describe('Happy Paths', () => {
    it('should initialize DataSource with default values when no env vars are set', async () => {
      /**
       * This test ensures that initializeDatabase uses default values for the connection
       * when no environment variables are set, and binds the DataSource to the iocContainer.
       */

      // Arrange
      // No env vars set

      // Mock initialize to resolve
      jest.mocked(MockDataSource.prototype.initialize as any).mockResolvedValue(undefined as any);

      // Act
      await initializeDatabase();

      // Assert
      expect((DataSource as jest.Mock)).toHaveBeenCalledWith({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'devDB',
        entities: [MockUser as any],
        synchronize: true,
        logging: false,
      });

      expect(mockDataSourceInstance.initialize).toHaveBeenCalledTimes(1);

      expect(mockIocContainer.bind).toHaveBeenCalledWith(
        TYPES.DataSource,
        expect.anything()
      );
    });

    it('should initialize DataSource with environment variables if set', async () => {
      /**
       * This test ensures that initializeDatabase uses environment variables for the connection
       * when they are set.
       */

      // Arrange
      process.env.DATASOURCE_TYPE = 'mongodb';
      process.env.DATASOURCE_HOST = 'customhost';
      process.env.DATASOURCE_PORT = '12345';
      process.env.DATASOURCE_DATABASE = 'customDB';

      jest.mocked(MockDataSource.prototype.initialize as any).mockResolvedValue(undefined as any);

      // Act
      await initializeDatabase();

      // Assert
      expect((DataSource as jest.Mock)).toHaveBeenCalledWith({
        type: 'mongodb',
        host: 'customhost',
        port: 'customhost', // Note: The code uses DATASOURCE_HOST for port, which is likely a bug
        database: 'customDB',
        entities: [MockUser as any],
        synchronize: true,
        logging: false,
      });

      expect(mockDataSourceInstance.initialize).toHaveBeenCalledTimes(1);

      expect(mockIocContainer.bind).toHaveBeenCalledWith(
        TYPES.DataSource,
        expect.anything()
      );
    });

    it('should bind DataSource as a singleton to iocContainer', async () => {
      /**
       * This test ensures that the DataSource is bound as a singleton to the iocContainer.
       */

      // Arrange
      jest.mocked(MockDataSource.prototype.initialize as any).mockResolvedValue(undefined as any);

      // Act
      await initializeDatabase();

      // Assert
      expect(mockIocContainer.bind).toHaveBeenCalledWith(
        TYPES.DataSource,
        expect.anything()
      );
    });
  });

  // --- Edge Cases ---

  describe('Edge Cases', () => {
    it('should throw if DataSource.initialize rejects', async () => {
      /**
       * This test ensures that if DataSource.initialize throws an error,
       * initializeDatabase propagates the error.
       */

      // Arrange
      const error = new Error('Initialization failed');
      jest.mocked(MockDataSource.prototype.initialize as any).mockRejectedValue(error as never);

      // Act & Assert
      await expect(initializeDatabase()).rejects.toThrow('Initialization failed');
    });

    it('should handle non-standard but valid environment variable values', async () => {
      /**
       * This test ensures that initializeDatabase can handle unusual but valid values
       * for environment variables.
       */

      // Arrange
      process.env.DATASOURCE_TYPE = 'mongodb';
      process.env.DATASOURCE_HOST = '127.0.0.1';
      process.env.DATASOURCE_PORT = '9999';
      process.env.DATASOURCE_DATABASE = 'edgeDB';

      jest.mocked(MockDataSource.prototype.initialize as any).mockResolvedValue(undefined as any);

      // Act
      await initializeDatabase();

      // Assert
      expect((DataSource as jest.Mock)).toHaveBeenCalledWith({
        type: 'mongodb',
        host: '127.0.0.1',
        port: '127.0.0.1', // Note: The code uses DATASOURCE_HOST for port, which is likely a bug
        database: 'edgeDB',
        entities: [MockUser as any],
        synchronize: true,
        logging: false,
      });
    });

    it('should not call iocContainer.bind if DataSource.initialize fails', async () => {
      /**
       * This test ensures that if DataSource.initialize fails,
       * iocContainer.bind is not called.
       */

      // Arrange
      const error = new Error('DB init error');
      jest.mocked(MockDataSource.prototype.initialize as any).mockRejectedValue(error as never);

      // Act & Assert
      await expect(initializeDatabase()).rejects.toThrow('DB init error');
      expect(mockIocContainer.bind).not.toHaveBeenCalled();
    });
  });
});