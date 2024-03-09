import express from "express";
import { routerPublic } from "../route/api-public";
import { errorMiddleware } from "../middleware/error-middleware";
import { apiRouter } from "../route/api";

export const web = express();

web.use(express.json())

web.use(routerPublic)
web.use(apiRouter)

web.use(errorMiddleware)