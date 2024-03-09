import { User } from "@prisma/client"
import { prismaClient } from "../../src/application/database"
import bcrypt from "bcrypt"

export class UserTestUtils {
    static async remove () {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    static async create () {
        await prismaClient.user.create({
            data: {
                username: 'test',
                password: await bcrypt.hash('test', 10),
                name: 'test',
                token: 'test'
            }
        })
    }

    static async get () : Promise<User>{
        const user = await prismaClient.user.findFirst({
            where: {
                username: 'test'
            }
        })

        if(!user){
           throw new Error('user not found')
        }

        return user

    }

}