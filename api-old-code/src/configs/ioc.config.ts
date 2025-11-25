// src/ioc.config.ts
import { Container, decorate, injectable } from 'inversify';
import "reflect-metadata";
import { UserService } from '../services/UserService.service';
import { UserRepository } from '../repositories/UserRepository.repository';
import { IUserRepository } from '../interfaces/IUserRepository.interface';
import { IUserService } from '../interfaces/IUserService.interface';
import { UserController } from '../controllers/UserController.controller';
import { Controller } from 'tsoa';
import { buildProviderModule } from "inversify-binding-decorators";
import { DataSource } from 'typeorm';
import  { TYPES } from "../types/binding.types"
import { DatabaseProvider } from "../services/database.service";



const iocContainer = new Container();

decorate(injectable(), Controller); 
iocContainer.load(buildProviderModule());


export const configureIOC = () => {
    // Bind Interfaces to Implementations:
    iocContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
    iocContainer.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
// Bind the interface to the concrete implementation
    iocContainer.bind<UserController>(UserController).toSelf();
    iocContainer.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider).inSingletonScope();
    iocContainer.bind<DataSource>(DataSource).toConstantValue(iocContainer.get(DatabaseProvider).getDataSource()); // Bind DataSource instance

    iocContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();


}

export { iocContainer };


/**
 import { Container } from "inversify";
import { DatabaseProvider } from "./services/database.service";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { DataSource } from "typeorm";

const container = new Container();

container.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider).inSingletonScope();
container.bind<DataSource>(DataSource).toConstantValue(container.get(DatabaseProvider).getDataSource()); // Bind DataSource instance
container.bind<UserService>(UserService).to(UserService);
// Bind controllers if using inversify-binding-controllers
// e.g., container.bind<UserController>(UserController).to(UserController); 

export { container };

 */
// 5. Export the container as "iocContainer" (required by tsoa)




