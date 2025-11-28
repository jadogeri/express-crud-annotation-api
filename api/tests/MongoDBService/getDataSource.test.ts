
import { DataSource, EntityMetadata, EntitySchema } from "typeorm";
import { User } from "../../src/entities/User.entity";
import { MongoDBService } from '../../src/services/MongoDBService.service';


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

describe('MongoDBService.getDataSource() getDataSource method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should return a DataSource instance with correct configuration', async () => {
      // This test ensures getDataSource returns a DataSource with expected config
      const provider = new MongoDBService();
      const dataSource = provider.getDataSource();
      expect(dataSource).toBeDefined();
      expect(dataSource.options).toBeDefined();
      expect(dataSource.options.type).toBe('mongodb');
      expect(dataSource.options.database).toBe('testdb');
      expect(dataSource.options.entities).toContain(User);
      expect(dataSource.options.synchronize).toBe(true);
      expect(dataSource.options.logging).toBe(true);
    });

    it('should always return the same DataSource instance (singleton behavior)', () => {
      // This test ensures getDataSource returns the same instance every time
      const provider = new MongoDBService();
      const ds1 = provider.getDataSource();
      const ds2 = provider.getDataSource();

      expect(ds1).toBe(ds2);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return DataSource even if called multiple times in rapid succession', () => {
      // This test ensures repeated calls do not break the singleton pattern
      const provider = new MongoDBService();
      const instances = Array.from({ length: 10 }, () => provider.getDataSource());
      instances.forEach((instance) => {
        expect(instance).toBe(instances[0]);
      });
    });

    it('should not throw when getDataSource is called before DataSource is initialized', () => {
      // This test ensures getDataSource does not depend on DataSource initialization
      const provider = new MongoDBService();
      expect(() => provider.getDataSource()).not.toThrow();
    });


  });
});