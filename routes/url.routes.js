import express from "express"
import { deleteUrlById, getAllTheUrls, redirectToTargetUrl, shortenTheUserUrl } from "../controllers/url.controllers.js"
import { isAuthenticated } from "../middlewares/custom.middleware.js"

export const urlRouter = express.Router()

// urlRouter.get("/:shortCode", redirectToTargetUrl) // As this is dynamic route it should be kept last in stack
 
urlRouter.post("/shorten", isAuthenticated, shortenTheUserUrl)

urlRouter.get("/urls", isAuthenticated, getAllTheUrls)

urlRouter.delete("/delete/:urlId", isAuthenticated, deleteUrlById)

urlRouter.get("/:shortCode", redirectToTargetUrl) // As this is dynamic route it should be kept last in stack