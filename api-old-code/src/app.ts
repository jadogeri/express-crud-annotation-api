
// app.ts
import 'reflect-metadata'; 
import express from 'express';
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { RegisterRoutes } from "./routes";
import * as swaggerJson from "./swagger.json";
import * as swaggerUI from "swagger-ui-express";
import { configureIOC } from './configs/ioc.config';

dotenv.config();

configureIOC();

export const app = express();


//middlewares
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



RegisterRoutes(app);
app.use(["/openapi", "/docs", "/swagger"], swaggerUI.serve, swaggerUI.setup(swaggerJson));




// src/app.ts (server setup)



