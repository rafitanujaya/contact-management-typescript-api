import { User } from "@prisma/client";
import { CreateContactRequest, ResponseContact, SearchContactRequest, UpdateContactRequest, toContactResponse } from "../model/contact-model";
import { Validation } from "../validation/validation";
import { ContactValidation } from "../validation/contact-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../exception/response-exception";
import { SearchResponse } from "../model/page";

export class ContactService {
    static async create (user: User, request : CreateContactRequest): Promise<ResponseContact>{
        const contactReq = Validation.validate(ContactValidation.CREATE, request);

        const createContact = {
            ...contactReq,
            username: user.username
        }

        const contact = await prismaClient.contact.create({
            data: createContact
        })

        return toContactResponse(contact);
    }

    static async get (user: User, contactId: number) : Promise<ResponseContact> {
        const contactInDatabase = await prismaClient.contact.findUnique({
            where: {
                id: contactId,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        return toContactResponse(contactInDatabase);
    }

    static async update (user: User, request : UpdateContactRequest): Promise<ResponseContact> {
        const requestContact = Validation.validate(ContactValidation.UPDATE, request);

        const contactInDatabase = await prismaClient.contact.findUnique({
            where: {
                id: requestContact.id,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        const contactUpdate = await prismaClient.contact.update({
            where: {
                id: requestContact.id,
                username: user.username
            },
            data: requestContact
        })
        console.log(contactUpdate);
        return toContactResponse(contactUpdate)
    }

    static async delete (user: User, contactId: number): Promise<void> {
        const contactInDatabase = await prismaClient.contact.findUnique({
            where: {
                id: contactId,
                username: user.username
            }
        })

        if(!contactInDatabase) {
            throw new ResponseError(404, 'Contact not found')
        }

        await prismaClient.contact.delete({
            where: {
                id: contactId,
                username: user.username
            }
        })
    }

    static async search (user: User, request : SearchContactRequest ) : Promise<SearchResponse<ResponseContact>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request);

        const skip = ( searchRequest.page -1 ) * searchRequest.size 

        const filter = [];

        // with query name
        if(searchRequest.name){
            filter.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name
                        },
                        last_name: {
                            contains: searchRequest.name
                        }
                    }
                ]
            })
        }
        // with query email
        if(searchRequest.email) {
            filter.push({
                email: {
                    contains: searchRequest.email
                }
            })
        }
        // with query phone
        if(searchRequest.phone) {
            filter.push({
                phone: {
                    contains: searchRequest.phone
                }
            })
        }

        const searchContact = await prismaClient.contact.findMany({
            where: {
                username: user.username,
                AND: filter
            },
            take: searchRequest.size,
            skip: skip
        })
        console.log(searchContact.length);
        
        // ? If you need the total value for page 1, if the data is empty, you can use this
        // const count = searchContact.length < 1 ? 1 : searchContact.length;
        const count = searchContact.length;


        return {
            data: searchContact.map(val => toContactResponse(val)),
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(count / searchRequest.size)
            }
        }
    }

}