import "dotenv/config"

import express from "express"
import { userRouter } from "./routes/user.routes.js"
import { urlRouter } from "./routes/url.routes.js"
import { authenticateUser } from "./middlewares/custom.middleware.js"

const app = express()
const PORT = process.env.PORT ?? 8000

app.use(express.json())
app.use(authenticateUser)

app.get("/test-route", (req, res) => {
    return res
        .status(200)
        .json({
            Status: "Ok",
            Message: `App is up and running.`
        })
})

app.use("/user", userRouter)

app.use(urlRouter) // Here as we to treat it is root level thing so we are not adding any kind of prefix to it. Should be loaded later not earlier. Else every route will match it.

app.listen(PORT, function(){
    console.log(`App is running on, PORT: ${PORT}`);  
})