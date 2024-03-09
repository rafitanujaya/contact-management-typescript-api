import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../exception/response-exception";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid";

export class UserService {
    static async register(request: CreateUserRequest) : Promise<UserResponse> {
        const userRequest = Validation.validate(UserValidation.REQUEST, request);

        const userInDatabase = await prismaClient.user.count({
            where: {
                username: userRequest.username
            }
        })

        if(userInDatabase !== 0) {
            throw new ResponseError(400, 'User Already Exist')
        }

        userRequest.password = await bcrypt.hash(userRequest.password, 10)

        const user = await prismaClient.user.create({
            data: userRequest
        })

        const userResponse : UserResponse = {
            name: user.name,
            username: user.username
        } 

        return userResponse
    }

    static async login (req: LoginUserRequest) : Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, req);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if(!user) {
            throw new ResponseError(400, 'username or password is wrong');
        }

        const isValid = await bcrypt.compare(loginRequest.password, user.password);

        if(!isValid) {
            throw new ResponseError(400, 'username or password is wrong');
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(user);
        response.token = user.token!;

        return response
    }

    static async get (user: User): Promise<UserResponse> {
        return toUserResponse(user)
    }

    static async update (user: User, req: UpdateUserRequest): Promise<UserResponse> {
        console.log(req);
        const updateRequest = Validation.validate(UserValidation.UPDATE, req)
        console.log(updateRequest);
        if(updateRequest.name) {
            user.name = updateRequest.name
        }

        if(updateRequest.password) {
            user.password = await bcrypt.hash(updateRequest.password, 10)
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username
            }, 
            data: user
        })

        console.log(result);

        return toUserResponse(result);

    }

    static async delete (user: User) : Promise<UserResponse> {
        const result = prismaClient.user.update({
            where: {
                username: user.username
            }, 
            data: {
                token: null
            }
        })

        return toUserResponse(user)
    }
}