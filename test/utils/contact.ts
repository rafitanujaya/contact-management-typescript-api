import { Contact } from "@prisma/client";
import { prismaClient } from "../../src/application/database";

export class ContactTestUtils {
    static async deleteAll() {
        await prismaClient.contact.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async create() {
        await prismaClient.contact.create({
            data: {
                first_name: 'test',
                last_name: "test",
                email:"test@gmai;.com",
                phone:"00821",
                username: "test"
            }
        })
    }

    static async get(): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: 'test'
            }
        })

        if(!contact){
            throw new Error('contact not found')
        }

        return contact
    }
}