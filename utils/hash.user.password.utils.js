import { createHmac, randomBytes } from "crypto"


export const hashUserPassword = async function (password) {
    const salt = randomBytes(16)
        .toString("hex")

    console.log("Generated Salt: ", salt);
    

    const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex")
    
    console.log("Hashed Password: ", hashedPassword);
    

    return {hashedPassword, salt}
}