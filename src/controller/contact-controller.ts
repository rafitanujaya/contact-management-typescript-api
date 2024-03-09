import { NextFunction, Response } from "express";
import { RequestUser } from "../type/user-request";
import { User } from "@prisma/client";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";

export class ContactController {
    static async create (req: RequestUser, res: Response, next : NextFunction) {
        try {
            const user: User = req.user!;
            const request : CreateContactRequest = req.body as CreateContactRequest
            const result = await ContactService.create(user, request);
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async get (req: RequestUser, res: Response, next : NextFunction) {
        try {
            const user: User = req.user!;
            const contactId: number = Number(req.params.contactId)
            const result = await ContactService.get(user, contactId);
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async update (req: RequestUser, res: Response, next : NextFunction) {
        try {
            const user: User = req.user!;
            const contactId: number = Number(req.params.contactId)
            const request: UpdateContactRequest = req.body as UpdateContactRequest;
            request.id = contactId
            const result = await ContactService.update(user, request);
            res.status(200).json({
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async delete (req: RequestUser, res: Response, next : NextFunction) {
        try {
            const user: User = req.user!;
            const contactId: number = Number(req.params.contactId)
            await ContactService.delete(user, contactId);
            res.status(200).json({
                data: "OK"
            })
        } catch (error) {
            next(error)
        }
    }

    static async search (req: RequestUser, res: Response, next : NextFunction) {
        try {
            const user: User = req.user!;
            const request : SearchContactRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: Number(req.query.page? req.query.page : 1),
                size: Number(req.query.size? req.query.size : 10)

            }

            const respone = await ContactService.search(user, request)
            res.status(200).json(respone)
        } catch (error) {
            next(error)
        }
    }
}