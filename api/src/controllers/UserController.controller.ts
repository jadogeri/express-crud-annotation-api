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

import { Controller as BaseController, Body, Delete, Get, Post, Put, Route, Tags, Response} from "tsoa";
import { IUserController } from "src/interfaces/IUserController.interface";
import { inject, injectable } from "inversify";
import { IUserService } from "src/interfaces/IUserService.interface";
import { TYPES } from "../types/binding.types";
import { Controller } from "../decorators";
import { UserCreationBody } from "../types/UserType.type";

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
  @Get("{userId}")
  async getUser(): Promise<any> {
    return await this.userService.getOne();
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