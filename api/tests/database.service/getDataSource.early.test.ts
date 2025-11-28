
import { User } from "../../src/entities/User.entity";
import { DatabaseProvider } from '../../src/services/database.service';


// api/src/services/database.service.getDataSource.spec.ts


// api/src/services/database.service.getDataSource.spec.ts
// Mock the User entity to avoid DB dependencies
jest.mock("../../src/entities/User.entity", () => ({
  User: jest.fn().mockImplementation(() => ({})),
}));

// Mock DataSource from typeorm
jest.mock("typeorm", () => {
  const actualTypeorm = jest.requireActual("typeorm");
  return {
    ...actualTypeorm,
    DataSource: jest.fn().mockImplementation((options) => ({
      options,
      // Simulate DataSource methods if needed
      isInitialized: false,
      initialize: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    })),
  };
});

describe('DatabaseProvider.getDataSource() getDataSource method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a DataSource instance with correct configuration', () => {
      // This test ensures getDataSource returns a DataSource with expected config
      const provider = new DatabaseProvider();
      const dataSource = provider.getDataSource();

      expect(dataSource).toBeDefined();
      expect(dataSource.options).toBeDefined();
      expect(dataSource.options.type).toBe('mongodb');
      expect(dataSource.options?.host).toBe('localhost');
      expect(dataSource.options?.port).toBe(27017);
      expect(dataSource.options.database).toBe('testdb');
      expect(dataSource.options.entities).toContain(User);
      expect(dataSource.options.synchronize).toBe(true);
      expect(dataSource.options.logging).toBe(true);
    });

    it('should always return the same DataSource instance (singleton behavior)', () => {
      // This test ensures getDataSource returns the same instance every time
      const provider = new DatabaseProvider();
      const ds1 = provider.getDataSource();
      const ds2 = provider.getDataSource();

      expect(ds1).toBe(ds2);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return DataSource even if called multiple times in rapid succession', () => {
      // This test ensures repeated calls do not break the singleton pattern
      const provider = new DatabaseProvider();
      const instances = Array.from({ length: 10 }, () => provider.getDataSource());
      instances.forEach((instance) => {
        expect(instance).toBe(instances[0]);
      });
    });

    it('should return a DataSource with entities array containing only User', () => {
      // This test ensures the entities array is as expected
      const provider = new DatabaseProvider();
      const dataSource = provider.getDataSource();

      expect(Array.isArray(dataSource.options.entities)).toBe(true);
      expect(dataSource.options.entities.length).toBe(1);
      expect(dataSource.options.entities[0]).toBe(User);
    });

    it('should not throw when getDataSource is called before DataSource is initialized', () => {
      // This test ensures getDataSource does not depend on DataSource initialization
      const provider = new DatabaseProvider();
      expect(() => provider.getDataSource()).not.toThrow();
    });

    it('should preserve configuration if DataSource is modified after construction', () => {
      // This test ensures that changes to the DataSource object are reflected
      const provider = new DatabaseProvider();
      const dataSource = provider.getDataSource();
      dataSource.options.database = 'changedb';
      expect(provider.getDataSource().options.database).toBe('changedb');
    });
  });
});