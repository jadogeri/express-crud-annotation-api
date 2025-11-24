
// app.ts
import 'reflect-metadata'; 
import express from 'express';
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

dotenv.config();


export const app = express();

//middlewares
app.use(express.json())
app.use(bodyParser.json());
