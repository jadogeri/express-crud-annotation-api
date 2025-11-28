import { GenericContainer } from "testcontainers";

const MONGODB_IMAGE = "mongo:latest"; // Use a specific version in production code

// Define the container (e.g., in a test utility file)
export const createMongoContainer = async () => {
  const container = await new GenericContainer(MONGODB_IMAGE)
    .withExposedPorts(27017)
    .start();

  // Get the dynamically assigned host and port
  const host = container.getHost();
  const port = container.getMappedPort(27017);

  // Return connection details or a connection string
  return { container, host, port };
};
