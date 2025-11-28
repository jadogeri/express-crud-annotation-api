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

    iocContainer.bind<UserController>(UserController).toSelf();

    iocContainer.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
   // Bind the interface to the concrete implementation
    iocContainer.bind<DatabaseProvider>(DatabaseProvider).to(DatabaseProvider).inSingletonScope();
    iocContainer.bind<DataSource>(DataSource).toConstantValue(iocContainer.get(DatabaseProvider).getDataSource()); // Bind DataSource instance

iocContainer.bind<IUserRepository>(TYPES.IUserRepository).toDynamicValue(
    () => {
        const dataSource = iocContainer.get(DatabaseProvider).getDataSource()
        return new UserRepository(dataSource);
    }
).inSingletonScope();



}

export { iocContainer };

