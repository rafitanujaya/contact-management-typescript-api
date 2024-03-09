import { User } from "@prisma/client";
import { RequestAddress, RequestDeleteAddress, RequestGetAddress, RequestUpdateAddress, ResponseAddress, toResponseAddress } from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../exception/response-exception";

export class AddressService {
    static async create (user: User, request: RequestAddress) : Promise<ResponseAddress> {
        const addressRequest = Validation.validate(AddressValidation.CREATE, request);

        const contactInDatabase = await prismaClient.contact.findFirst({
            where: {
                id: addressRequest.contact_id,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const createContact = await prismaClient.address.create({
            data: addressRequest
        })

        return toResponseAddress(createContact)
    }

    static async get (user: User, request : RequestGetAddress) : Promise<ResponseAddress> {
        const addressRequest = Validation.validate(AddressValidation.GET, request);

        const contactInDatabase = await prismaClient.contact.findFirst({
            where: {
                id: addressRequest.contact_id,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const address = await prismaClient.address.findFirst({
            where: {
                contact_id: addressRequest.contact_id,
                id: addressRequest.id
            }
        })

        if(!address) {
            throw new ResponseError(404, 'Address not found')
        }

        return toResponseAddress(address)
    }

    static async update (user: User, request : RequestUpdateAddress) : Promise<ResponseAddress> {
        const addressRequest = Validation.validate(AddressValidation.UPDATE, request);

        const contactInDatabase = await prismaClient.contact.findFirst({
            where: {
                id: addressRequest.contact_id,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const addressInDatabase = await prismaClient.address.findFirst({
            where: {
                contact_id: addressRequest.contact_id,
                id: addressRequest.id
            }
        })

        if(!addressInDatabase) {
            throw new ResponseError(404, 'Address not found')
        }

        const updateAddress = await prismaClient.address.update({
            where: {
                id: addressRequest.id,
                contact_id: addressRequest.contact_id
            },
            data: addressRequest
        })

        return toResponseAddress(updateAddress)
    }

    static async list (user: User, contactId: number) : Promise<ResponseAddress[]> {
        const contactInDatabase = await prismaClient.contact.findFirst({
            where: {
                id: contactId,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const addresses = await prismaClient.address.findMany({
            where: {
                contact_id: contactId
            }
        })

        return addresses.map(address => toResponseAddress(address))
    }

    static async delete (user: User, request: RequestDeleteAddress) : Promise<void> {
        const addressRequest = Validation.validate(AddressValidation.DELETE, request);
        const contactInDatabase = await prismaClient.contact.findFirst({
            where: {
                id: addressRequest.contact_id,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const addressInDatabase = await prismaClient.address.findFirst({
            where: {
                contact_id: addressRequest.contact_id,
                id: addressRequest.id
            }
        })

        if(!addressInDatabase) {
            throw new ResponseError(404, 'Address not found')
        }

        await prismaClient.address.delete({
            where: {
                id: addressRequest.id
            }
        })
    }
}