import jwt from "jsonwebtoken"

export const authenticateUser = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization
        console.log("Auth Header: ", authHeader);

        if(!authHeader) return next()

        if(!authHeader.startsWith("Bearer ")){
            return res
                .status(400)
                .json({
                    Error: `Authorization Header Must Start With, "Bearer " Keyword.`
                })
        }

        // const [_, authorizationToken] = authHeader(" ") // First Value: Bearer (as we do require that value so we have user "_"), Second Value: authorization token that we want. And We have sepearated both values using split.

        const authorizationToken = authHeader.split(" ")[1]
        console.log("Authorization Token: ", authorizationToken);

        const verifyToken = jwt.verify(authorizationToken, process.env.JWT_SECRET)
        console.log("Verified Token: ", verifyToken);

        req.user = verifyToken
        next()
    } catch (error) {
        return res
            .status(500)
            .json({
                Error: `Internal Server Error.`
            })
    }
}

export const isAuthenticated = async function (req, res, next) {
    if(!req.user){
        return res
            .status(401)
            .json({
                Status: "UNAUTHORIZED ACCESS",
                Error: `User not logged in.`
            })
    }
    
    next()
}