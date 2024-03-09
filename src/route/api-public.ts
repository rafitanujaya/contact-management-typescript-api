import express from "express";
import { UserController } from "../controller/user-controller";

export const routerPublic = express.Router();

routerPublic.post('/api/users/register', UserController.register);
routerPublic.post('/api/users/login', UserController.login);