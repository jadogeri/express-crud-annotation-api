import { app } from "./app";
import { initializeDatabase } from "./data-source"
const port =  3000;



initializeDatabase().then(() => {
    // Start your tsoa server here
  app.listen(port, () =>{
    console.log(`🚀 Server is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/docs`);
  });
}).catch(error => console.error("Database initialization failed:", error));

