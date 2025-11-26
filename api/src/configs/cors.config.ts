import express, { Application, Request } from 'express';
import cors, { CorsOptions } from 'cors';


// Add a list of allowed origins (e.g., your frontend application's URL)
const allowedOrigins = ['http://localhost:3000', 'https://www.yourapp.com', '*'];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins, // The origin option can also be a function for dynamic origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  credentials: true // Set to true if you need to include cookies in CORS requests
};

