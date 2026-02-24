import { createHmac } from "crypto"


export const verifyUserProviedPassword = async function(password, salt){
    const verifyPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex")

    return verifyPassword
}