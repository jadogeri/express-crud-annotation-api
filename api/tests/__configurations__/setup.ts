// setup.e2e.ts

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.setTimeout(15000);
}); 