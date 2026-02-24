import { shortenUrlPostRequestValidationSchema } from "../validation schema/zod.validation.url.schema.js"
import {db} from "../db/index.js"
import {urlsTable} from "../models/index.js"
import {nanoid} from "nanoid"
import { and, eq } from "drizzle-orm"

export const shortenTheUserUrl = async function (req, res) {
    const validationResult = await shortenUrlPostRequestValidationSchema.safeParseAsync(req.body)
    console.log("Validation Result: ", validationResult);

    if(!validationResult.success){
        return res
            .status(400)
            .json({
                Error: validationResult.error
            })
    }

    const {url, code} = validationResult.data

    const shortCode = code ?? nanoid(8) // if id length passed: 8, for 1000 id's per second. ~40 minutes or 2M IDs needed, in order to have a 1% probability of at least one collision.

    const [result] = await db
        .insert(urlsTable)
        .values({
            shortCode,
            targetUrl: url,
            userId: req.user.userId
        })
        .returning({
            urlId: urlsTable.id,
            shortCode: urlsTable.shortCode,
            targetUrl: urlsTable.targetUrl
        })

    console.log("Reuslt: ", result);

    return res
        .status(201)
        .json({
            Status: "Success",
            urlId: result.urlId,
            shortCode: result.shortCode,
            targetUrl: result.targetUrl
        })
}


export const redirectToTargetUrl = async function (req, res) {
    const shortCode = req.params.shortCode
    console.log("Short Code: ", shortCode);

    const [result] = await db
        .select({
            targetUrl: urlsTable.targetUrl
        })
        .from(urlsTable)
        .where(eq(urlsTable.shortCode, shortCode))

    console.log("Result: ", result);

    if(!result){
        return res
            .status(404)
            .json({
                Error: `Invalid URL`
            })
    }

    return res
        .redirect(result.targetUrl)   
}

export const getAllTheUrls = async function (req, res) {
    const result = await db
        .select()
        .from(urlsTable)
        .where(eq(req.user.userId, urlsTable.userId))

    console.log("Result", result);

    return res
        .status(200)
        .json({
            URLS: result
        })
}

export const deleteUrlById = async function (req, res) {
    const urlId = req.params.urlId
    console.log("URL Id: ", urlId);

    const result = await db
        .delete(urlsTable)
        .where(
            and(eq(urlsTable.id, urlId), eq(urlsTable.userId, req.user.userId))
        )

    console.log("Result: ", result);

    return res
        .status(200)
        .json({
            Status: "Success",
            Message: `URL with, URL Id: ${urlId} delted successfully`
        })
    
    
}