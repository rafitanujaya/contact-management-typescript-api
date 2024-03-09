import { Contact } from "@prisma/client";

export type CreateContactRequest = {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
}

export type UpdateContactRequest = {
    id: number;
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
}

export type SearchContactRequest = {
    name?: string;
    email?: string;
    phone?: string;
    page: number;
    size: number;
}

export type ResponseContact = {
    id: number;
    first_name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string | null;
}

export const toContactResponse = (contact : Contact) : ResponseContact => {
    return {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone
    }
}