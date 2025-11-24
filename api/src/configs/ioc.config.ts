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



// Define Symbols for DI binding (best practice in Inversify)
export const TYPES = {
    IUserService: Symbol.for("IUserService"),
    IUserRepository: Symbol.for("IUserRepository"),
    IUserController: Symbol.for("IUserController"),

};

const iocContainer = new Container();

decorate(injectable(), Controller); 
iocContainer.load(buildProviderModule());


export const configureIOC = () => {
    // Bind Interfaces to Implementations:
    iocContainer.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
    iocContainer.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
// Bind the interface to the concrete implementation
    iocContainer.bind<UserController>(UserController).toSelf();

}

export { iocContainer };



