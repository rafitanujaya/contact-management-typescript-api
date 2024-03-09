import { NextFunction, Response, Request } from "express";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, UserResponse } from "../model/user-model";
import { UserService } from "../service/user-service";
import { RequestUser } from "../type/user-request";
import { User } from "@prisma/client";

export class UserController {
    static async register (req: Request, res: Response, next: NextFunction) {
        try {
            const request : CreateUserRequest = req.body as CreateUserRequest;
            const result: UserResponse = await UserService.register(request);
            res.status(201).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async login (req: Request, res: Response, next: NextFunction) {
        try {
            const request : LoginUserRequest = req.body as LoginUserRequest;
            const result = await UserService.login(request);

            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async get (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const result = await UserService.get(user);
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async update (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const request: UpdateUserRequest = req.body as UpdateUserRequest
            const result = await UserService.update(user, request);
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            await UserService.delete(user);
            res.status(200).json({
                data: 'Ok'
            })
        } catch (error) {
            next(error)
        }
    }
}