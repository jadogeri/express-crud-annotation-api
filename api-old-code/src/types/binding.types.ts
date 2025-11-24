// Define Symbols for DI binding (best practice in Inversify)
export const TYPES = {
    IUserService: Symbol.for("IUserService"),
    IUserRepository: Symbol.for("IUserRepository"),
    IUserController: Symbol.for("IUserController"),
    DataSource: Symbol.for("DataSource"),

};