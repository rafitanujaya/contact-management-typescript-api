import { NextFunction, Response } from "express";
import { RequestUser } from "../type/user-request";
import { User } from "@prisma/client";
import { RequestAddress, RequestGetAddress, RequestUpdateAddress } from "../model/address-model";
import { AddressService } from "../service/address-service";

export class AddressController {
    static async create (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const request : RequestAddress = {
                contact_id: Number(req.params.contactId),
                street: req.body.street,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postal_code: req.body.postal_code,
            }

            const response = await AddressService.create(user, request);
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async get (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const request : RequestGetAddress = {
                id: Number(req.params.addressId),
                contact_id: Number(req.params.contactId)
            }

            const response = await AddressService.get(user, request);
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async update (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const request : RequestUpdateAddress = {
                id: Number(req.params.addressId),
                contact_id: Number(req.params.contactId),
                street: req.body.street,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                postal_code: req.body.postal_code,
            }

            const response = await AddressService.update(user, request);
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async list (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const contactId: number = Number(req.params.contactId)
            const response = await AddressService.list(user, contactId);
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete (req: RequestUser, res: Response, next: NextFunction) {
        try {
            const user: User = req.user!;
            const request : RequestGetAddress = {
                id: Number(req.params.addressId),
                contact_id: Number(req.params.contactId)
            }

            await AddressService.delete(user, request);
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }
}