import { buildApp } from "./app";
const port =  process.env.EXPRESS_APP_PORT || 3000;
import { MongoDBService } from "./services/MongoDBService.service";
import { iocContainer } from "./configs/ioc.config";
import { Application } from "express";

const app : Application = buildApp();
async function bootstrap() {
  await iocContainer.get(MongoDBService).connect();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(port , () => {
      console.log(`🚀 Server is running on: http://localhost:${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/docs`);
    });
  }
}

bootstrap().catch(console.error);


