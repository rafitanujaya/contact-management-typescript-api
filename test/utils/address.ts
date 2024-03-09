import { Address } from "@prisma/client";
import { prismaClient } from "../../src/application/database";
import { ContactTestUtils } from "./contact";

export class AddressTestUtils {
    static async deleteAll() {

        const contact = await ContactTestUtils.get()
        await prismaClient.address.deleteMany({
            where: {
                contact_id: contact.id,
                contact: {
                    username: 'test'
                }
            }
        })
    }

    static async create() : Promise<void> {
        const contact = await ContactTestUtils.get()
        
        await prismaClient.address.create({
            data : {
                street: 'jalan baru',
                city: 'kota baru',
                province: 'provinsi baru',
                country: 'indonesia',
                postal_code: '5432',
                contact_id: contact.id
            }
        })
    }

    static async get() : Promise<Address> {
        const contact = await ContactTestUtils.get()
        const address = await prismaClient.address.findFirst({
            where: {
                contact_id: contact.id,
            }
        })

        if(!address) {
            throw new Error('address not found')
        }

        return address
    }
}