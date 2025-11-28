import { GenericContainer, StartedTestContainer } from "testcontainers";

const MONGODB_IMAGE = "mongo:latest"; // Use a specific version in production code

// Define the container (e.g., in a test utility file)
export const createMongoContainer = async () => {
  const container : StartedTestContainer= await new GenericContainer(MONGODB_IMAGE)
    .withExposedPorts(27017)
    .start();

  // Get the dynamically assigned host and port
  const host : string = container.getHost();
  const port : number = container.getMappedPort(27017);

  // Return connection details or a connection string
  return { container, host, port };
};
