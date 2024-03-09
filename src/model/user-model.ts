import { User } from "@prisma/client";

export type CreateUserRequest= {
    username:string;
    password:string;
    name:string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UserResponse= {
    username:string;
    name:string;
    token?:string
}

export type UpdateUserRequest = {
    name? : string;
    password? : string;
}

export const toUserResponse = (user : User) : UserResponse => {
    return {
        name: user.name,
        username: user.username
    }
}