/*import {
  Body, Controller, Get, Path, Post, Query, Route, SuccessResponse,
  Tags
} from "tsoa";
@Route("users")
@Tags("User")
export class UsersController extends Controller implements IUserController {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<any> {
    return new UsersService().get(userId, name);
  } 
  
  @SuccessResponse("201", "Created")
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    new UsersService().create(requestBody);
    return;
  }
}

*/

import { Controller as BaseController, Body, Delete, Get, Post, Put, Route, Tags, Response, Path} from "tsoa";
import { IUserController } from "src/interfaces/IUserController.interface";
import { inject, injectable } from "inversify";
import { IUserService } from "src/interfaces/IUserService.interface";
import { TYPES } from "../types/binding.types";
import { Controller } from "../decorators";
import { UserCreationBody } from "../types/UserType.type";
import mongoose from "mongoose"
import { ObjectId } from "mongodb";

interface ValidateErrorJSON {
  message: "Validation failed";
details: string[];}


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
  
  @Post()
  async createUser( @Body() requestBody: UserCreationBody
): Promise<any> {

    return await this.userService.create(requestBody);
  }
    /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID from either and receive corresponding user details.
   * @param userId The user's identifier
   */
  @Get("{userId}")
  async getUser(@Path() userId: string): Promise<any> {

    if(!mongoose.isObjectIdOrHexString(userId)){
      this.setStatus(400);
      
      return {message: `id '${userId}' is not valid`}
    }

    const mongoId = new mongoose.Types.ObjectId(userId)
    return await this.userService.getOne(mongoId);
  }
  @Get("")
  async getUsers(): Promise<any> {
    const users = await this.userService.getAll()
    console.log("list of users: ", users)
    return users;
  }
  @Put("{userId}")
  async updateUser(): Promise<any> {
    return await this.userService.update();
  }
  @Delete("{userId}")
  async deleteUser(): Promise<any> {
    return await this.userService.delete();
  }
  
}