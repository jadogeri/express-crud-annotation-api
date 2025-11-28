
import { User } from "../../src/entities/User.entity";
import { DatabaseProvider } from '../../src/services/database.service';


// database.service.connect.spec.ts


// database.service.connect.spec.ts
// Mock DataSource class from typeorm
jest.mock("typeorm", () => {
  const actual = jest.requireActual("typeorm");
  return {
    ...actual,
    DataSource: jest.fn().mockImplementation((options) => {
      return {
        ...options,
        isInitialized: false,
        initialize: jest.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

// Mock User entity (no methods to mock, just a placeholder)
jest.mock("../../src/entities/User.entity", () => ({
  User: jest.fn(),
}));

describe('DatabaseProvider.connect() connect method', () => {
  // Happy Paths
  describe('Happy Paths', () => {
    it('should initialize the dataSource if not already initialized', async () => {
      // This test ensures that connect calls initialize when isInitialized is false

      // Arrange
      const provider = new DatabaseProvider();
      // @ts-ignore: access private for test
      provider.dataSource.isInitialized = false;
      // @ts-ignore: access private for test
      const initializeSpy = jest.spyOn(provider.dataSource, 'initialize');

      // Act
      await provider.connect();

      // Assert
      expect(initializeSpy).toHaveBeenCalledTimes(1);
    });

    it('should not initialize the dataSource if already initialized', async () => {
      // This test ensures that connect does not call initialize when isInitialized is true

      // Arrange
      const provider = new DatabaseProvider();
      // @ts-ignore: access private for test
      provider.dataSource.isInitialized = true;
      // @ts-ignore: access private for test
      const initializeSpy = jest.spyOn(provider.dataSource, 'initialize');

      // Act
      await provider.connect();

      // Assert
      expect(initializeSpy).not.toHaveBeenCalled();
    });

    it('should use the correct DataSource configuration', async () => {
      // This test ensures that the DataSource is constructed with the expected configuration

      // Arrange
      const provider = new DatabaseProvider();

      // Act
      // @ts-ignore: access private for test
      const ds = provider.dataSource;

      // Assert
      expect(ds.type).toBe('mongodb');
      expect(ds.host).toBe('localhost');
      expect(ds.port).toBe(27017);
      expect(ds.database).toBe('testdb');
      expect(ds.entities).toContain(User);
      expect(ds.synchronize).toBe(true);
      expect(ds.logging).toBe(true);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should propagate errors thrown by dataSource.initialize', async () => {
      // This test ensures that if initialize throws, connect propagates the error

      // Arrange
      const provider = new DatabaseProvider();
      // @ts-ignore: access private for test
      provider.dataSource.isInitialized = false;
      const error = new Error('Initialization failed');
      // @ts-ignore: access private for test
      provider.dataSource.initialize = jest.fn().mockRejectedValue(error);

      // Act & Assert
      await expect(provider.connect()).rejects.toThrow('Initialization failed');
    });

    it('should not call initialize more than once if connect is called multiple times and isInitialized is set to true after first call', async () => {
      // This test ensures that initialize is not called again if isInitialized is set to true after the first call

      // Arrange
      const provider = new DatabaseProvider();
      // @ts-ignore: access private for test
      provider.dataSource.isInitialized = false;
      // @ts-ignore: access private for test
      const initializeMock = jest.fn().mockImplementation(function (this: any) {
        this.isInitialized = true;
        return Promise.resolve();
      });
      // @ts-ignore: access private for test
      provider.dataSource.initialize = initializeMock;

      // Act
      await provider.connect(); // should call initialize
      await provider.connect(); // should NOT call initialize again

      // Assert
      expect(initializeMock).toHaveBeenCalledTimes(1);
    });
  });
});