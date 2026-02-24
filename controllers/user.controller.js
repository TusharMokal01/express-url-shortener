import { checkIfAnExistingUser, createNewUserInDB } from "../services/user.services.js";
import { hashUserPassword } from "../utils/hash.user.password.utils.js";
import { loginPostRequestValidationSchema, signupPostRequestValidationSchema } from "../validation schema/zod.validation.schema.js"
import { verifyUserProviedPassword } from "../utils/verify.user.password.utils.js";
import { createToken } from "../utils/createToken.user.utils.js";

export const resgisterUser = async function (req, res) {
    const validationResult = await signupPostRequestValidationSchema.safeParseAsync(req.body)
    console.log("Validation Result: ", validationResult);

    if(!validationResult.success){
        return res
            .status(400)
            .json({
                Error: validationResult.error.format()
            })
    }

    const {firstName, lastName, email, password} = validationResult.data
    console.log(`firstName: ${firstName}, lastName: ${lastName}, email: ${email}, password: ${password}`);

    const existingUser = await checkIfAnExistingUser(email)

    if(existingUser){
        return res
            .status(409)
            .json({
                Error: `User with, Email: ${email} already exist.`
            })
    }

    const {hashedPassword, salt} = await hashUserPassword(password)

    const newUser = await createNewUserInDB({firstName, lastName, email, password: hashedPassword, salt})

    return res
        .status(200)
        .json({
            Status: "Success",
            Message: `User with, User Id: ${newUser.userId}`
        })
}

export const userLogin = async function (req, res) {
    const validationResult = await loginPostRequestValidationSchema.safeParseAsync(req.body)
    console.log("Validation Result: ", validationResult);

    if(!validationResult.success){
        return res
            .status(400)
            .json({
                Error: validationResult.error.format()
            })
    }

    const {email, password} = validationResult.data

    const existingUser = await checkIfAnExistingUser(email)
    console.log("Exsting User: ", existingUser);

    if(!existingUser){
        return res
            .status(404)
            .json({
                Error: `User with, Email: ${email} does not exist.`
            })
    }
    console.log("EUP: ", existingUser.password);

    const salt = existingUser.salt
    
    console.log("EUS: ", salt);
    

    const verifyPassword = await verifyUserProviedPassword(password, salt)

    console.log("Verified Password: ", verifyPassword);
    

    if(verifyPassword != existingUser.password){
        return res
            .status(401)
            .json({
                Status: "UNAUTHORIZED ACCESS",
                Error: `Incorrect Password`
            })
    }

    const payload = {
        userId: existingUser.userId
    }

    const token = await createToken(payload)

    return res
        .status(201)
        .json({
            Status: "Access Granted",
            Message: "User Acess Token: ", token
        })
}
