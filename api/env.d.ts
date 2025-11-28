import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            EXPRESS_APP_PORT:number;
            NODE_ENV:string;
            DATASOURCE_TYPE:MongoConnectionOptions["type"];
            DATASOURCE_HOST:MongoConnectionOptions["host"] 
            DATASOURCE_PORT:MongoConnectionOptions["port"]
            DATASOURCE_DATABASE:MongoConnectionOptions["database"]

        }
    }
}

export {}

