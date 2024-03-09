import { Address } from "@prisma/client";

export type RequestAddress = {
    contact_id : number;
    street: string;
    city: string;
    province: string;
    country: string;
    postal_code: string;
}

export type RequestGetAddress = {
    id: number;
    contact_id: number;
}

export type RequestDeleteAddress = {
    id: number;
    contact_id: number;
}

export type RequestUpdateAddress = {
    id: number;
    contact_id: number;
    street?: string | null;
    city?: string | null;
    province?: string | null;
    country: string;
    postal_code: string;
}

export type ResponseAddress = {
    id: number;
    street?: string | null;
    city?: string | null;
    province?: string | null;
    country: string;
    postal_code: string;
}

export const toResponseAddress = (address: Address) : ResponseAddress => {
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code
    }
}