
import { Controller as BaseController, Body, Delete, Get, Post, Put, Route, Tags, Response, Path, Example, SuccessResponse} from "tsoa";
import { IUserController } from "../interfaces/IUserController.interface";
import { inject } from "inversify";
import { IUserService } from "../interfaces/IUserService.interface";
import { TYPES } from "../types/binding.types";
import { Controller } from "../decorators";
import { UserCreationBody, UserUpdateBody } from "../types/UserType.type";
import mongoose from "mongoose"
import { ObjectId } from "mongodb";
import { UserCreationResponse } from "../dto/response/UserCreationResponse.dto";
import { UserReadResponse } from "../dto/response/UserReadResponse.dto";
import { UserModificationResponse } from "../dto/response/UserModificationResponse.dto";
import { CustomError } from "../exceptions/CustomError.exception";


interface ValidateErrorJSON {
  message: "Validation failed";
  details: string[];
}

/**
 * Controller for managing user-related operations.
 * Provides endpoints to retrieve and manage user profiles.
 */
@Route("users")
@Tags("User")
@Controller() 
@Response<ValidateErrorJSON>(422, "Validation Failed")
export class UserController extends BaseController implements IUserController {

  private readonly userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    super();
    this.userService = userService;
  }
  /**
   * Creates a new user in the system.
   * @summary Create a new user
   * @param requestBody The user details for creation.
   * @returns The newly created user.
   */
  @SuccessResponse("201", "Created")
  @Post()
  @Example<UserCreationResponse>({
    _id: new ObjectId("60b8f4d5f8a3c3001f3e9a0e"),
    name: "john doe",
    email: "johndoe@tsoa.com",
    age:21,
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T11:30:00Z"),
  })    
  async createUser( @Body() requestBody: UserCreationBody): Promise<UserCreationResponse> {

    return await this.userService.create(requestBody);
  }
    /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID and receive corresponding user details.
   * @param userId The user's identifier
   * @example userId "60b8f4d5f8a3c3001f3e9a0e"
   * @summary Gets a single user.
   * @returns The requested user.
   */
  @Example<UserReadResponse>({
    _id: new ObjectId("60b8f4d5f8a3c3001f3e9a0e"),
    name: "john doe",
    email: "johndoe@tsoa.com",
    age:21,
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T11:30:00Z"),
  })  
  @Get("{userId}")
  async getUser(@Path() userId: string): Promise<any> {

    if(!mongoose.isObjectIdOrHexString(userId)){
      this.setStatus(400);      
      return {message: `id '${userId}' is not valid`}
    }

    const mongoId = new mongoose.Types.ObjectId(userId)
    return await this.userService.getOne(mongoId);
  }

    /**
   * Retrieves the a list of existing users.
   * Supply the unique user ID from either and receive corresponding user details.
   * @summary Gets all users.
   * @returns A list of requested users.
   */
  @Example<UserReadResponse[]>([{
    _id: new ObjectId("60b8f4d5f8a3c3001f3e9a0e"),
    name: "john doe",
    email: "johndoe@tsoa.com",
    age:21,
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T11:30:00Z"),
  },{
    _id: new ObjectId("60b8f4d5f8a3c3001f3e9a0e"),
    name: "jane doe",
    email: "janedoe@tsoa.com",
    age:22,
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T11:30:00Z"),
  }]) 
  @SuccessResponse("200", "Ok") 
  @Get("")
  async getUsers(): Promise<any> {
    const users = await this.userService.getAll()
    return users;
  }

  /**
   * Updates a user in the system.
   * @summary Updates an existing user
   * @param requestBody The user details for modification.
   * @param userId The user's identifier
   * @example userId "60b8f4d5f8a3c3001f3e9a0e"
   * @returns The newly updated user.
   */
    @Example<UserModificationResponse>({
    _id: new ObjectId("60b8f4d5f8a3c3001f3e9a0e"),
    name: "john doe",
    email: "johndoe@tsoa.com",
    age:21,
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T11:30:00Z"),
  })  
  @Put("{userId}")
  async updateUser(@Path() userId: string, @Body() requestBody: UserUpdateBody): Promise<any> {

    if(!requestBody.age && !requestBody.email && !requestBody.name ){
      throw new CustomError(400, "at least one field must be supplied")
    }

    if(!mongoose.isObjectIdOrHexString(userId)){
      this.setStatus(400);      
      return {message: `id '${userId}' is not valid`}
    }
    const mongoId = new mongoose.Types.ObjectId(userId);

    return await this.userService.update(mongoId, requestBody );
  }

    /**
   * Removes an existing user in database.
   * Supply the unique user ID and deletes corresponding user details.
   * @param userId The user's identifier
   * @example userId "60b8f4d5f8a3c3001f3e9a0e"
   * @summary Deletes a single user.
   * @returns successful deletion.
   */
  @Delete("{userId}")
  async deleteUser(@Path() userId: string): Promise<any> {

    if(!mongoose.isObjectIdOrHexString(userId)){
      this.setStatus(400);      
      return {message: `id '${userId}' is not valid`}
    }
    const mongoId = new mongoose.Types.ObjectId(userId);    
    return await this.userService.delete(mongoId);
  }
  
}