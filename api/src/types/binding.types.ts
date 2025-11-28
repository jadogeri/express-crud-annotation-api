// Define Symbols for DI binding (best practice in Inversify)
export const TYPES = {
    IUserService: Symbol.for("IUserService"),
    IUserRepository: Symbol.for("IUserRepository"),
    IUserController: Symbol.for("IUserController"),
    IDatabaseService: Symbol.for("IDatabaseService"),
    MongoRepositoryUser: Symbol.for('MongoRepositoryUser'), // Symbol for the base repository
    DataSource: Symbol.for("DataSource"),
    UserService: Symbol.for('UserService'),
};