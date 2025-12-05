import { inject } from "inversify";
import { Service } from "../decorators";
import { IUserService } from "../interfaces/IUserService.interface";
import { UserRepository } from "../repositories/UserRepository.repository";
import { TYPES } from "../types/binding.types";
import { UserCreationBody, UserUpdateBody } from "../types/UserType.type";
import mongoose from "mongoose";
import { CustomError } from "../exceptions/CustomError.exception";
import { DeleteResult } from "typeorm";

@Service()
export class UserService implements IUserService{

  constructor(@inject(TYPES.IUserRepository) private userRepository: UserRepository) {}   

/**
     * Creates a new user after validating that the email and name are unique.
     * Throws an error if a user with the same email or name already exists.
     * 
     * @param {UserCreationBody} requestBody - The data required to create a new user.
     * @returns {Promise<any>} - The saved user object.
     * @throws {CustomError} - Throws a 400 error if the email or name already exists.
     */
  async create(requestBody: UserCreationBody): Promise<any> {
    const userFoundByEmail = await this.userRepository.findByEmail(requestBody.email);
    if(userFoundByEmail){
        
        throw new CustomError(400, `user with email '${requestBody.email}' already exists`)
    }
    const userFoundByName = await this.userRepository.findByEmail(requestBody.name);

    if(userFoundByName){
                
        throw new CustomError(400, `user with name '${requestBody.name}' already exists`)
    }

    const savedUser =  await this.userRepository.save(requestBody);   
    return savedUser;        

}

/**
     * Retrieves a user by their MongoDB ObjectId. 
     * Throws a CustomError if no user is found with the provided id.
     * 
     * @param mongoId - The MongoDB ObjectId of the user to retrieve.
     * @returns A promise that resolves to the found user object.
     * @throws CustomError - If no user is found with the specified id.
     */
    async getOne(mongoId: mongoose.Types.ObjectId): Promise<any> {

        const foundUser =  await this.userRepository.findById(mongoId);
        if(!foundUser){
        throw new CustomError(404, `no user found with id '${mongoId}'`)
                
        }
        return foundUser
    }
/**
     * Retrieves all user records from the database.
     * @returns A promise that resolves to an array of user records.
     * @throws Will throw an error if the database query fails.
     */
    async getAll(): Promise<any> {

        return await this.userRepository.find({});
    }
/**
     * Updates a user's information in the database based on the provided MongoDB ID and request body.
     * Checks for the existence of the user and validates unique fields (email and name) before updating.
     * 
     * @param mongoId - The MongoDB ObjectId of the user to be updated.
     * @param requestBody - An object containing the fields to be updated in the user record.
     * @returns A promise that resolves to the updated user object.
     * @throws CustomError if the user is not found (404), if the email or name already exists (400), or if a server error occurs (500).
     */
    async update(mongoId: mongoose.Types.ObjectId, requestBody:UserUpdateBody ): Promise<any> {
        const foundUser =  await this.userRepository.findById(mongoId);
        if(!foundUser){
        throw new CustomError(404, `no user found with id '${mongoId}'`)                
        }
        if(requestBody.email){
            const userFoundByEmail = await this.userRepository.findByEmail(requestBody.email);
            if(userFoundByEmail){
                
                throw new CustomError(400, `user with email '${requestBody.email}' already exists`)
            }
        }
        if(requestBody.name){
            const userFoundByName = await this.userRepository.findByEmail(requestBody.name);

            if(userFoundByName){
                        
                throw new CustomError(400, `user with name '${requestBody.name}' already exists`)
            }

        }
        const result = await this.userRepository.update(mongoId, { ...requestBody });
        if(result.affected == 1){
            return await this.userRepository.findById(mongoId);
        }
        throw new CustomError(500," Server error occured while updating")
    }
/**
     * Deletes a user from the repository by their MongoDB ObjectId.
     * If the user is not found, a 404 error is thrown. 
     * Returns a success message upon successful deletion.
     * 
     * @param mongoId - The MongoDB ObjectId of the user to be deleted.
     * @returns A promise that resolves to a success message.
     * @throws CustomError - Throws a 404 error if no user is found with the given id.
     */
    async delete(mongoId: mongoose.Types.ObjectId): Promise<any> {
        const foundUser =  await this.userRepository.findById(mongoId);
        if(!foundUser){
        throw new CustomError(404, `no user found with id '${mongoId}'`)                
        }

        const response: DeleteResult = await this.userRepository.delete(mongoId)
        if(response?.affected == 1){
            return {
                message : `successfully deleted user with id '${mongoId.toString()}'`
            }
        }else{
            return {
                message : `failed to delete user with id '${mongoId.toString()}'`
            }

        }
    }

}


