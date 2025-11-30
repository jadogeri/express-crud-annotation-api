
// app.ts
import 'reflect-metadata'; 
import express,{ Application, json, urlencoded} from 'express';
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { RegisterRoutes } from "./routes";
import * as swaggerJson from "./swagger.json";
import * as swaggerUI from "swagger-ui-express";
import { configureIOC } from './configs/ioc.config';
import { corsOptions } from './configs/cors.config';
import cors from 'cors';
import { notFoundHandler } from './middlewares/noRouteHandler.middleware';
import { globalErrorHandler } from './middlewares/globalErrorHandler.middleware';


dotenv.config();

export const buildApp  = () : Application =>{
configureIOC();

const app: Application = express();

//middlewares
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the configured CORS middleware
app.use(cors(corsOptions));
// Enable pre-flight requests for all routes (necessary when using specific headers/methods)
//app.options('*', cors(corsOptions) as any); 

app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);

app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.use(globalErrorHandler);
app.use(notFoundHandler)

return app;

}
