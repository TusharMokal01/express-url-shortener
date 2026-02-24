import { eq } from "drizzle-orm"
import {db} from "../db/index.js"
import {usersTable} from "../models/index.js"

export const checkIfAnExistingUser = async function (email) {
    const [existingUser] = await db
        .select({
            userId: usersTable.id,
            email: usersTable.email,
            password: usersTable.password,
            salt: usersTable.salt
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))

    console.log("Exsiting User: ", existingUser);
    
    return existingUser
}

export const createNewUserInDB = async function ({firstName, lastName, email, password, salt}) {
    const [user] = await db
        .insert(usersTable)
        .values({
            firstName,
            lastName,
            email,
            password,
            salt
        })
        .returning({
            userId: usersTable.id
        })

    console.log("New User: ", user);

    return user
}