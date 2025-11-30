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
import { MongoDBService } from "../services/MongoDBService.service";
import { IDatabaseService } from '../interfaces/IDatabaseService.interface';
import { IUserController } from '../interfaces/IUserController.interface';

const iocContainer = new Container();

decorate(injectable(), Controller); 
iocContainer.load(buildProviderModule());


export const configureIOC = () => {

    iocContainer.bind<UserController>(UserController).toSelf();

    //iocContainer.bind<UserController>(TYPES.IUserController).to(UserController).inSingletonScope();


    iocContainer.bind<IDatabaseService>(TYPES.IDatabaseService).to(MongoDBService).inSingletonScope();
    iocContainer.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
   // Bind the interface to the concrete implementation
    iocContainer.bind<MongoDBService>(MongoDBService).to(MongoDBService).inSingletonScope();
    iocContainer.bind<DataSource>(DataSource).toConstantValue(iocContainer.get(MongoDBService).getDataSource()); // Bind DataSource instance

    iocContainer.bind<IUserRepository>(TYPES.IUserRepository).toDynamicValue(
    () => {
        const dataSource = iocContainer.get(MongoDBService).getDataSource()
        return new UserRepository(dataSource);
    }
).inSingletonScope();

return iocContainer

}

export { iocContainer };

