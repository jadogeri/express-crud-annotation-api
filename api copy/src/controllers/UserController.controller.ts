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

import { Controller as BaseController, Delete, Get, Post, Put, Route, Tags} from "tsoa";
import { IUserController } from "src/interfaces/IUserController.interface";
import { inject, injectable } from "inversify";
import { IUserService } from "src/interfaces/IUserService.interface";
import { TYPES } from "../types/binding.types";
import { Controller } from "../decorators";


@Route("users")
@Tags("User")
@Controller()
export class UserController extends BaseController implements IUserController {

    private readonly userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    super();
    this.userService = userService;
  }

  @Post()
  async createUser(): Promise<any> {
    return await this.userService.create();
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