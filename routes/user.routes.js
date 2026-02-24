import express from "express"
import { resgisterUser, userLogin } from "../controllers/user.controller.js"

export const userRouter = express.Router()

userRouter.post("/signup", resgisterUser)

userRouter.post("/login", userLogin)