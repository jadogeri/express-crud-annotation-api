// Define Symbols for DI binding (best practice in Inversify)
export const TYPES = {
    IUserService: Symbol.for("IUserService"),
    IUserRepository: Symbol.for("IUserRepository"),
    UserRepository: Symbol.for("UserRepository"),
    IUserController: Symbol.for("IUserController"),
    MongoRepositoryUser: Symbol.for('MongoRepositoryUser'), // Symbol for the base repository
    DataSource: Symbol.for("DataSource"),

};