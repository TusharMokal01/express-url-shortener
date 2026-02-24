import jwt from "jsonwebtoken"

export const createToken = async function (payload) {

    const token = jwt.sign(payload, process.env.JWT_SECRET)
    console.log("Token: ", token);
    
    return token
}