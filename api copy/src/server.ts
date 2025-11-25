import { app } from "./app";
import { initializeDatabase } from "./data-source"
const port =  3000;
import { DatabaseProvider } from "./services/database.service";
import { iocContainer } from "./configs/ioc.config";

async function bootstrap() {
  await iocContainer.get(DatabaseProvider).connect();
    app.listen(port , () => {
      console.log(`🚀 Server is running on: http://localhost:${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/docs`);
  });
}

bootstrap().catch(console.error);


// }).catch(error => console.error("Database initialization failed:", error));

